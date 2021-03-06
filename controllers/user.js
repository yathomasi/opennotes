const models = require("../db/models");
const errors = require("restify-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const redisClient = require("../config/redisClient");

exports.listUsers = (req, res, next) => {
  models.User.findAll({
    attributes: { exclude: ["password", "createdAt", "updatedAt"] }
  })
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
  models.User.findOne({
    where: { userId },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] }
  })
    .then(user => {
      if (!user) {
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
exports.getMe = (req, res, next) => {
  try {
    let user = req.user;
    res.json(user);
    next();
  } catch (err) {
    return next(new errors.UnauthorizedError(err));
  }
};

exports.registerUser = (req, res, next) => {
  // Check for JSON
  if (!req.is("application/json")) {
    return next(new errors.InvalidContentError("Expects 'application/json'"));
  }
  let { name, username, email, password } = req.body;
  if (password !== req.body.confirmPassword) {
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
          const payload = { id: user.userId };
          const jwtOptions = {
            issuer: config.JWT_ISSUER,
            expiresIn: config.JWT_EXP
          };
          const token = jwt.sign(payload, config.JWT_SECRET, jwtOptions);
          res.json({ userId: user.userId, token: token });
          // res.json({ msg: "You are successfully logged in" });
          next();
        } else {
          return next(
            new errors.InvalidCredentialsError(
              "Please check your credentials and try again."
            )
          );
        }
      } else {
        return next(
          new errors.InvalidCredentialsError(
            "Such username doesn't exist. You can register to create one"
          )
        );
      }
    })
    .catch(err => {
      return next(new errors.UnauthorizedError(err));
    });
};

exports.logout = (req, res, next) => {
  // logout user
  // save token in redis
  const token = req.headers.authorization.split(" ")[1];

  redisClient.lpush("token", token, (err, reply) => {
    if (err) {
      return next(new errors.UnauthorizedError(err));
    }
    console.log(reply);
    res.send({
      msg: "You are logged out"
    });
  });
};
