const models = require("../db/models");
const { body, validationResult } = require("express-validator");
const passRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

const loginValidation = () => {
  return [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please provide your username.")
      .isAlphanumeric()
      .withMessage("Username is alphanumeric")
      .isLength({ max: 50 })
      .withMessage("Username is of maximum length 50.")
      .trim(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8 })
      .withMessage("Password should be minimum eight characters")
  ];
};
const registerValidation = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Name is required")
      .isLength({ max: 50 })
      .withMessage("Name is of maximum length 50")
      .trim(),
    body("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid username")
      .normalizeEmail()
      .custom(value => {
        return models.User.findOne({ where: { email: value } }).then(user => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      }),
    body("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isAlphanumeric()
      .withMessage("Username is alphanumeric")
      .isLength({ max: 50 })
      .withMessage("Username is of maximum length 50")
      .custom(value => {
        return models.User.findOne({ where: { username: value } }).then(
          user => {
            if (user) {
              return Promise.reject("Username already in use");
            }
          }
        );
      })
      .trim(),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password should not be empty")
      .isLength({ min: 8 })
      .withMessage("Password should be minimum eight characters")
      .matches(passRegex)
      .withMessage(
        "Password should be at least one number and one special character."
      )
      .custom((value, { req }) => {
        if (value == req.body.passwordConfirmation) {
          return true;
        }
      })
      .withMessage("Passwords do not match!")
  ];
};
const postNoteValidation = () => {
  return [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Title is required")
      .isLength({ max: 255 })
      .withMessage("Title has maximum length 255")
      .trim(),
    body("content")
      .not()
      .isEmpty()
      .withMessage("Content is required")
      .trim()
  ];
};
const validate = (req, res, next) => {
  let error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }
  let extractedErrors = [];
  error.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  res.send(422, { error: extractedErrors });
  return next();
};

module.exports = {
  registerValidation,
  loginValidation,
  postNoteValidation,
  validate
};
