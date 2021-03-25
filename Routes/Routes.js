const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const { MONGOURI } = require("../config/config");
const bcrypt = require("bcryptjs");
const schema = require("../validation/user.validation");
const MAdmin = require("../models/admin.model");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const isAuth = require("../protectRoutes/ProtectRoutes");
const uploads = require("../config/upload");

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
  })
  .catch((err) => {
    console.log("error in mongoose connection", err);
  });

//global middlewares
//this will read all the file of passport;
require("../Auth/localAuth");
require("../Auth/googleOAuth");
//global middleware for passport js;
routes.use(express.urlencoded({ extended: true }));
//always place session middleware before passport middleware;
routes.use(cookieParser("secret"));
routes.use(
  session({
    secret: "secret",
    maxAge: 3600000, //equals to 2 weeks
    resave: true,
    saveUninitialized: true,
  })
);

routes.use(passport.initialize());
routes.use(passport.session());

routes.use(flash());

routes.use((req, res, next) => {
  res.locals.successMessage = req.flash("successMessage");
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.error = req.flash("error");
  next();
});

require("../protectRoutes/ProtectRoutes");

// ***************************************************GET ROUTES START*******************************************

routes.get("/", isAuth, (req, res) => {
  res.render("index");
});

routes.get("/login", (req, res) => {
  res.render("login");
});

routes.get("/register", (req, res) => {
  res.render("register");
});

routes.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

routes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

routes.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

// ***************************************************GET ROUTES END*******************************************
// ***************************************************POST ROUTES START*******************************************
routes.post("/register", uploads.single("file"), (req, res) => {
  let { email, firstName, lastName, userName, password } = req.body;
  const result = schema.validate(req.body);
  if (typeof result.error !== "undefined") {
    res.render("register", {
      err: result.error.message,
      email,
      userName,
      lastName,
      firstName,
    });
  } else if (typeof req.file === "undefined") {
    res.render("register", {
      err: "please select your image",
      email,
      userName,
      lastName,
      firstName,
    });
  } else {
    const file = req.file.fieldname;
    //find user by email;
    MAdmin.findOne({ email })
      .then((user) => {
        if (user) {
          console.log("user exist with this email");
          res.render("register", { err: "user exists with this email" });
        } else {
          bcrypt
            .genSalt(10)
            .then((salt) => {
              bcrypt
                .hash(password, salt)
                .then((hash) => {
                  password = hash;
                  //create user in database;
                  MAdmin.create({
                    userName,
                    password,
                    lastName,
                    firstName,
                    email,
                    file,
                  })
                    .then(() => {
                      req.flash(
                        "successMessage",
                        "Registration succeed login to continue...."
                      );
                      res.redirect("/login");
                    })
                    .catch((err) => {
                      res.render("register");
                      console.log("err in saving user to db", err);
                    });
                })
                .catch((err) => console.log("error in hashing password", err));
            })
            .catch((err) =>
              console.log("error in generating salt in bcrypt", err)
            );
        }
      })
      .catch((err) => console.log("error in finding user by email", err));
  }
});

routes.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true,
  })
);

// ***************************************************POST ROUTES END*******************************************

module.exports = routes;
