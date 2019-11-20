const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { ObjectID } = require("mongodb");
const Attachment = require("../models/Attachment");

// call with query to add a filter, see post_test.js for a similar example
router.get("/", (req, res) => {
  let filter = {};
  if (req.query.post_id) {
    filter.post_id = req.query.post_id;
  }
  // sorted by date, from latest to oldest
  const order = "desc"; // replace with "asc for ascending order"
  Comment.find(filter)
    .sort({ created_at: order })
    .then(
      comments => {
        res.json({ comments }); // can wrap in object if want to add more properties
      },
      error => {
        res.status(500).send(error); // server error
      }
    );
});

// create a comment
router.post("/", (req, res) => {
  Comment.create({
    author: req.body.author,
    post_id: req.body.post_id,
    body: req.body.body
  })
    .then(comment => {
      res.send(comment);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("bad request");
    });
});

router.delete("/:id", (req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then(comment => {
      if (!comment) {
        console.log("comment doesn't exist");
        res.status(404).send("comment doesn't exist");
      }
      res.json({ msg: "comment deleted", data: comment });
    })
    .catch(err => {
      res.status(400).send("comment not deleted, error, bad request");
    });
});

module.exports = router;
