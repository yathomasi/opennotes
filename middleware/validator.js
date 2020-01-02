const { body, validationResult } = require("express-validator");

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
  postNoteValidation,
  validate
};
