const models = require("../db/models");
const errors = require("restify-errors");

exports.listUsers = (req, res, next) => {
  models.User.findAll()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.getUser = (req, res, next) => {
  const userId = req.params.id;
  models.User.findOne({ where: { userId } })
    .then(user => {
      if (user === null) {
        return next(
          new errors.ResourceNotFoundError(
            `There is no users with the id of ${userId}`
          )
        );
      }
      res.json(user);
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.registerUser = (req, res, next) => {
  // Check for JSON
  if (!req.is("application/json")) {
    return next(new errors.InvalidContentError("Expects 'application/json'"));
  }
  let { name, username, email, password } = req.body;
  if (password !== req.body.passwordConfirmation) {
    return next(new errors.InvalidContentError("Passwords do not match"));
  }
  models.User.create({
    name,
    username,
    email,
    password
  })
    .then(user => {
      let data = {
        msg: "User registerd succesfully.",
        data: {
          userId: user.userId,
          username: user.username,
          email: user.email
        }
      };
      res.json(data);
      next();
    })
    .catch(err => {
      return next(new errors.InvalidContentError(err));
    });
  next();
};

exports.loginUser = (req, res, next) => {
  // Check for JSON
  if (!req.is("application/json")) {
    return next(new errors.InvalidContentError("Expects 'application/json'"));
  }
  const { username, password } = req.body;
  models.User.findOne({ where: { username } })
    .then(user => {
      if (user) {
        const valid = user.validPassword(password);
        if (valid) {
          res.json({ msg: "You are successfully logged in" });
          next();
        } else {
          return next(
            new errors.UnauthorizedError(
              "Please check your credentials and try again."
            )
          );
        }
      } else {
        return next(
          new errors.UnauthorizedError(
            "Such username doesn't exist. You can register to create one"
          )
        );
      }
    })
    .catch(err => {
      return next(new errors.UnauthorizedError(err));
    });
};
