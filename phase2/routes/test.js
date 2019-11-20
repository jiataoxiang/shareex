const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");

// Mongoose Model
const User = require("../models/User");
router.get("/", (req, res) => {
  res.send("test route");
});

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

router.get("/async-hello", async (req, res) => {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    const data = await axios.get("http://localhost:5000/hello");
    arr.push(data.data.msg);
  }
  res.json({ msg: arr });
});

router.get("/get", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

router.post("/post", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
