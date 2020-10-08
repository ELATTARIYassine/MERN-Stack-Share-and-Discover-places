const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === +placeId);
  if (!place) {
    throw new HttpError(
      "Could not find a place for the provided place ID.",
      404
    );
  }
  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((place) => {
    return place.creator === userId;
  });
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided user ID.")
    );
  }
  res.json({ place });
});

module.exports = router;
