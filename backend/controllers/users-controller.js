const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: 1,
    name: "Yassine",
    email: "yassine@gs.com",
    password: "123456",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError(
      "Fetching users failed, please try again laster."
    );
    return next(err);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(err);
  }
  if (existingUser) {
    const err = new HttpError("User already exists, please try to login.", 422);
    return next(err);
  }
  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://mk0travelawayrru2xew.kinstacdn.com/wp-content/uploads/2013/04/cochem-town-germany.jpg",
    places: [],
  });
  try {
    await createdUser.save();
  } catch (error) {
    const err = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(err);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(err);
  }
  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong",
        401
      )
    );
  }
  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
