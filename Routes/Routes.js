const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const { MONGOURI } = require("../config/config");
const bcrypt = require("bcryptjs");
const schema = require("../validation/user.validation");
const MsUser = require("../models/user.model");

//middlewares
routes.use(express.urlencoded({ extended: true }));
//mongooose connection
mongoose
  .connect(`${MONGOURI}`, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("database connection succeed");
  });

routes.get("/", (req, res) => {
  res.render("login");
});

routes.get("/register", (req, res) => {
  res.render("register");
});

routes.post("/register", (req, res) => {
  const result = schema.validate(req.body);
  let { email, firstName, lastName, userName, password, file } = req.body;
  if (typeof result.error === "undefined") {
    return MsUser.findOne({ email: email }, (err, data) => {
      //mongoose error;
      if (err) console.log("error in finding user with email");
      //if user exists render again register page with error;
      else if (data) {
        console.log("user finding by email succeed");
        res.render("register", {
          err: "user already exist with this email",
        });
      }
      //user does not exist then encrypt the password;
      else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) console.log("error in generating salt");
          else {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) console.log("error in hashing password");
              //assign hashed password to password;
              password = hash;
              MsUser({
                userName,
                firstName,
                lastName,
                password,
                file,
                email,
              }).save((err, data) => {
                if (err) console.log("error in saving user to db", err);
                else {
                  res.redirect("/");
                }
              });
            });
          }
        });
      }
    });
    return res.redirect("/");
  } else {
    res.render("register", {
      err: result.error.message,
      email,
      firstName,
      lastName,
      userName,
      file,
    });
  }
});
module.exports = routes;
