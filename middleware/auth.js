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
            // console.log(req.user)
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
