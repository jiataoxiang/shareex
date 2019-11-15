const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Mongoose Model
const User = require("../models/User");

router.get("/create_user", function(req, res, next) {
  User.create(
    {
      username: "xuxuwang",
      password: "qqwe"
    },
    (err, user) => {
      if (err) {
        res.end("User not created\n" + err.errmsg);
      }
      if (user) {
        res.end("User created\n" + user);
      } else {
        res.end("User not created, but no error returned");
      }
    }
  );
  return;
});

module.exports = router;
