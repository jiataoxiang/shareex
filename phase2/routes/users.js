const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const isAuth = require("../middleware/auth");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

// register
router.post("/", (req, res) => {
  const hour = 3600;
  User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })
    .then(user => {
      console.log("user created: ", user);
      jwt.sign(
        { id: user._id },
        config.get("jwtSecret"),
        {
          expiresIn: 1 * hour
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user._id,
              username: user.username
            }
          });
        }
      );
      // res.send(user);
    })
    .catch(err => {
      console.log("error when registering user: ", err);
      res.send(err.message);
    });
});

// login
router.post("/login", (req, res) => {
  const hour = 3600;
  const { username, password, email } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Please enter password" });
  }
  if (!username) {
    return res.status(400).json({ message: "Please enter username" });
  }
  try {
    User.findOne(
      {
        username: username
      },
      function(err, user) {
        console.log(user);
        if (!user) {
          return res.status(400).send({ message: "User does not exist" });
        }
        user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            jwt.sign(
              { id: user._id },
              config.get("jwtSecret"),
              {
                expiresIn: 1 * hour
              },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user._id,
                    username: user.username
                  },
                  message: "Authenticated"
                });
              }
            );
          } else {
            return res.status(400).send({ message: "The password is invalid" });
          }
        });
      }
    );
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log("delete user: ", err);
      return res.status(500).send(err);
    }
    if (!user) {
      return res.status(400).send("post doesn't exist");
    }
    user.remove();

    // req.flash("success", "Your account has been deleted.");
    // req.logout();
    // return res.redirect("/");
    return res.send("user deleted");
  });
});

// return user info without password, given it's logged in and token is provided and not expired
router.get("/auth", isAuth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => {
      res.json(user);
    });
});

module.exports = router;
