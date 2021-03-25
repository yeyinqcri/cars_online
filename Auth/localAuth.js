const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const MAdmin=require('../models/admin.model'); 
const bcrypt=require('bcryptjs');

  //custom fields
  const customFields = { usernameField: "email" };
  /**
   *callback to passed as second argument to passport middleware
   * @param  userName username from customFiled
   * @param  password username must be same as in name field in html form
   * @param   done callback function to give info to passport js libaray
   */
  const verifyCallBack = (email, password, done) => {
    MAdmin.findOne({ email: email }).then((user) => {
        if (!user) {
          //done function take two arguments first arguments tell err is none and second tell the passport that user is not auth;
          return done(null, false,{message:"User does not exists..."});
        } else {
          bcrypt.compare(password, user.password).then((match) => {
              if (!match) {
                return done(null, false,{message:"please enter correct password...."});
              } else {
                return done(null, user);
              }
            })
            .catch((err) => done(err));
        }
      })
      .catch((err) => done(err));
  };
  //create new instance of local strategy;
  const strategy = new LocalStrategy(customFields, verifyCallBack);
  //passport middlewre use strategy;
  passport.use(strategy);

  passport.serializeUser((user,done)=>{
    done(null,user._id);
  })
  passport.deserializeUser((_id,done)=>{
  MAdmin.findById(_id).then((user)=>{
    done(null,user);
  }).catch((err)=>done(err))

})