const config = require("../config/config");
const models = require("../db/models");
const errors = require("restify-errors");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redisClient");

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.JWT_SECRET;
jwtOptions.issuer = config.JWT_ISSUER;
jwtOptions.expiresIn = config.JWT_EXP;

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  // console.log("payload received", jwt_payload);
  models.User.findOne({
    where: { userId: jwt_payload.id },
    attributes: { exclude: ["password", "createdAt", "updatedAt"] }
  })
    .then(user => {
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    })
    .catch(err => {
      if (err) return next(new errors.UnprocessableEntityError(err));
    });
});

passport.use(strategy);

exports.authJWT = passport.authenticate("jwt", { session: false });

exports.validJWT = (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new errors.UnauthorizedError(
        "Access denied. No token provided. Please login."
      )
    );
  }
  let token = req.headers.authorization.split("Bearer ")[1];
  if (!token) {
    return next(
      new errors.UnauthorizedError(
        "Access denied. No token provided. Please login."
      )
    );
  }
  let jwtOptions = {};
  jwtOptions.issuer = config.JWT_ISSUER;
  jwtOptions.expiresIn = config.JWT_EXP;

  redisClient.lrange("token", 0, -1, (err, result) => {
    if (err) return next(new errors.UnauthorizedError(err));
    if (result.indexOf(token) > -1) {
      return next(
        new errors.UnauthorizedError(
          "Your Token is expired. Please login again."
        )
      );
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
            // console.log(req.user)
            return next();
          } else {
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
      //this causes to run next module even though process is not complete here
      // return next();
      //Kept here just for information
    }
  });
};
