// default requirements
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const md5 = require("md5");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDatabase");

const userSchema = new mongoose.Schema({
  email: "string",
  password: "string",
});

const User = mongoose.model("User", userSchema);

// page structure

app.get("/", function (req, res) {
  res.render("home");
});

// Login
app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  User.findOne(
    {
      email: req.body.username,
    },
    function (err, foundUser) {
      if (foundUser) {
        if (foundUser.password === md5(req.body.password)) {
          console.log("Login Successful");
          res.render("secrets");
        } else {
          console.log("Wrong Password");
          res.redirect("/login");
        }
      } else {
        console.log("Account does not exist.");
        res.redirect("/login");
      }
    }
  );
});

// Register
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save(function (err) {
    if (!err) {
      console.log("User has been registered");
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
