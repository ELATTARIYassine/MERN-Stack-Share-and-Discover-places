const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsFromAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: 1,
    title: "title",
    description: "desc",
    location: {
      lat: 123123,
      lng: 123123,
    },
    address: "something",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided place ID.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    const err = new HttpError(
      "Could not fetch places, please try again later."
    );
    return next(err);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user ID.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: getCoordsFromAddress(),
    image:
      "https://mk0travelawayrru2xew.kinstacdn.com/wp-content/uploads/2013/04/cochem-town-germany.jpg",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong, could not find the place that gonna be updated"
    );
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    const err = new HttpError(
      "Something went wrong, could not update the place"
    );
    return next(err);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError(
      "Something went wrong, could not delete the place"
    );
    return next(err);
  }
  try {
    place.remove();
  } catch (error) {
    const err = new HttpError(
      "Something went wrong, could not delete the place"
    );
    return next(err);
  }
  res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
