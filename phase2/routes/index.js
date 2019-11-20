const express = require("express");
const router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/hello", function(req, res) {
  res.json({ msg: "hello world" });
});

router.get("/many-hello", async (req, res) => {
  const hellos = [];
  for (let i = 0; i < 10; i++) {
    const data = await axios.get("http://localhost:5000/hello");
    hellos.push(data.data.msg);
    console.log(i);
  }
  res.json({ msg: "hellos", hellos });
});

module.exports = router;
