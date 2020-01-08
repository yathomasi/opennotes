const config = require("../config/config");
const models = require("../db/models");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");
const errors = require("restify-errors");
const userController = require("../controllers/user");
const {
  loginValidation,
  registerValidation,
  validate
} = require("../middleware/validator");
const auth = require("../middleware/auth");
const validJWT = (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return res.send(401, {
      auth: false,
      message: "Access denied. No token provided. Please login."
    });
  }
  let jwtOptions = {};
  jwtOptions.issuer = config.JWT_ISSUER;
  jwtOptions.expiresIn = config.JWT_EXP;

  redisClient.lrange("token", 0, -1, (err, result) => {
    if (err) res.send(400, err);
    if (result.indexOf(token) > -1) {
      res.send(400, {
        status: 400,
        error: "Your Token is expired. Please login again."
      });
      return next();
    } else {
      let jwt_payload;
      try {
        jwt_payload = jwt.verify(token, config.JWT_SECRET, jwtOptions);
      } catch (err) {
        return next(new errors.UnprocessableEntityError(err));
      }
      // console.log("jwt_payload", jwt_payload);
      models.User.findOne({
        where: { userId: jwt_payload.id },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      })
        .then(user => {
          if (user) {
            req.user = user;
            console.log("User in middleware", user);
            return next();
          } else {
            // next(null, false);
            return next(
              new errors.ResourceNotFoundError(
                "User not found. Please login again."
              )
            );
          }
        })
        .catch(err => {
          if (err) return next(new errors.UnprocessableEntityError(err));
        });
      return next();
    }
  });
};

module.exports = server => {
  server.get("/api/v1/users", validJWT, userController.listUsers);
  server.get("/api/v1/users/:id", userController.getUser);
  server.post(
    "/api/v1/register",
    registerValidation(),
    validate,
    userController.registerUser
  );
  server.post(
    "/api/v1/login",
    loginValidation(),
    validate,
    userController.loginUser
  );
  server.get("/api/v1/logout", auth.validJWT, userController.logout);
};
