const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = 10;
  bcrypt.hash(password, salt, function(err, hash) {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    User.create({
      username: username,
      password: hash
    })
      .then(user => {
        console.log("user created: ", user);
        res.send(user);
      })
      .catch(err => {
        console.log("error when registering user: ", err);
        res.send(err);
      });
  });
});

router.post("/login", (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  try {
    User.findOne(
      {
        username: req.body.username
      },
      function(err, user) {
        console.log(user);
        if (!user) {
          return res
            .status(400)
            .send({ message: "The username does not exist" });
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return res.send({
              message: "Authenticated"
            });
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

module.exports = router;
