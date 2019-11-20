const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { ObjectID } = require("mongodb");
const Attachment = require("../models/Attachment");

router.get("/", (req, res) => {
  Post.find({}).then(
    posts => {
      res.send({ posts }); // can wrap in object if want to add more properties
    },
    error => {
      res.status(500).send(error); // server error
    }
  );
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.send(post);
      }
      res.status(404).send("Post Not Found");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post("/", async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      body: req.body.body
    });
    const attachments = [];
    req.body.attachments.forEach(async attachment => {
      const new_attachment = await Attachment.create({
        type: attachment.type,
        body: attachment.body,
        post_id: post._id
      });
      attachments.push(new_attachment._id);
    });
    post.attachments = attachments;
    post.save();
    res.send("post created: \n", post);
  } catch (err) {
    res.status(400).send("post not created: bad request");
  }
});

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send("post id not valid");
  }
  Post.findById(req.params.id)
    .then(post => {
      console.log("deleting post: ", post);
      if (!post) {
        return res.status(400).send("post doesn't exist");
      }
      post.remove();
      return res.send("post deleted");
    })
    .catch(err => {
      console.log(err);
      res.stats(500).send("post not deleted");
    });
});

router.patch("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(404).send("post id not valid");
  }

  Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(post => {
      if (!post) {
        res.status(404).send("Post not found, and cannot update");
      } else {
        res.send(post);
      }
    })
    .catch(error => {
      res.status(400).send("Post not updated, bad request"); // bad request for changing the post.
    });
});

module.exports = router;
