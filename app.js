require('dotenv').config();
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const authRoutes = require("./routes/auth");
const codeRoutes = require("./routes/code");
const { profile } = require('console');

const app = express();
app.use(express.static("public"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));



/**
 * -------------- SESSION SETUP ----------------
 */

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGO_URL,
      collectionName: "sessions",
    }),
  })
);


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

require("./config/passport-config");
app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- DATABASE ----------------
 */

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});


/**
 * -------------- ROUTES ----------------
 */

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/exams", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("exams/index");
  } else {
    res.redirect("/login");
  }
});

app.use(authRoutes);
app.use(codeRoutes);


app.listen(3000, () => {
  console.log("Listening to port 3000..");
});

