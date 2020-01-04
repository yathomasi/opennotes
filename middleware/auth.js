const config = require("../config/config");
const models = require("../db/models");
const errors = require("restify-errors");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const passportFB = require("passport-facebook");

const FacebookStrategy = passportFB.Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.JWT_SECRET;
jwtOptions.issuer = config.JWT_ISSUER;
jwtOptions.expiresIn = config.JWT_EXP;

passport.use(
  new JwtStrategy(jwtOptions, function(jwt_payload, next) {
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
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name, id } = profile._json;
      models.Fbuser.findOne({
        where: { facebookid: id },
        attributes: { exclude: ["createdAt", "updatedAt"] }
      })
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            models.Fbuser.create({
              facebookid: id,
              email,
              name: first_name + " " + last_name
            })
              .then(user => {
                let data = {
                  msg: "User added successfully.",
                  data: {
                    id: user.facebookid,
                    name: user.name,
                    email: user.email
                  }
                };
                console.log(data);
                done(null, data.data);
              })
              .catch(err => {
                console.error(err);
                done(err);
              });
          }
        })
        .catch(err => {
          console.error(err);
          done(err);
        });
    }
  )
);
exports.authFB = passport.authenticate("facebook", {
  scope: "email",
  session: false
});
exports.authFBcallback = passport.authenticate("facebook", {
  successRedirect: "/account",
  failureRedirect: "/"
});
exports.authJWT = passport.authenticate("jwt", { session: false });
