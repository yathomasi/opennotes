const config = require("../config/config");
const models = require("../db/models");
const errors = require("restify-errors");
const passport = require("passport");
const passportJWT = require("passport-jwt");

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
  console.log("payload received", jwt_payload);
  let user;
  try {
    user = models.User.findOne({ where: { userId: jwt_payload.id } });
  } catch (err) {
    if (err) return next(new errors.UnprocessableEntityError(err));
  }
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

exports.authJWT = passport.authenticate("jwt", { session: false });
