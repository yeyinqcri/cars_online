const passport = require("passport");
const GoogleOAuthStrategy = require("passport-google-oauth2").Strategy;
const MAdmin = require("../models/admin.model");
const { CLIENT_ID, CLIENT_SECRET_ID } = require("../config/config");

//options
const authOptions = {
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET_ID,
  callbackURL: "/auth/google/redirect",
};

/**
 *
 * @param  accessToken
 * @param  refreshToken
 * @param  profile  contains user profile info
 * @param  done
   */

//verifyCallBack
const verifyCallBack = (accessToken, refreshToken, profile, done) => {
  MAdmin.findOne({ email: profile.emails[0].value })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        MAdmin.create({
          email: profile.emails[0].value,
          firstName: profile.given_name,
          lastName: profile.family_name,
          userName: profile.displayName,
          file: profile.photos[0].value,
        })
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            console.log("errror in creating user by oauth");
            return done(err);
          });
      }
    })
    .catch((err) => {
      console.log("error in finding user by oauth email");
      return done(err);
    });
};

//create new instance of local strategy;
const strategy = new GoogleOAuthStrategy(authOptions, verifyCallBack);

//passport middlewre use strategy;
passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((_id, done) => {
  MAdmin.findById(_id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
