const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Attachment = require("../models/Attachment");

router.get("/", (req, res) => {
  Post.find().then(
    posts => {
      res.send({ posts }); // can wrap in object if want to add more properties
    },
    error => {
      res.status(500).send(error); // server error
    }
  );
});

router.get("/:id", (req, res) => {
  Post.findById(req.params._id)
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

router.post("/", (req, res) => {
  Post.create({
    title: req.body.title,
    author: req.body.author,
    category: req.body.category,
    body: req.body.body
  })
    .then(post => {
      // construct all attachments and add their id to array
      const attachments = [];
      req.body.attachments.forEach(async attachment => {
        await Attachment.create({
          type: attachment.type,
          body: attachment.body,
          post_id: post._id
        }).then(attachment => {
          attachments.push(attachment._id);
        });
      });
      post.attachments = attachments;
      post.save();
      res.send(post);
    })
    .catch(error => {
      res.status(400).send(error); // 400 for bad request
    });
});

router.delete("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params._id)) {
    return res.status(404).send("post id not valid");
  }
  Post.findById(req.params._id).then(post => {
    if (!post) {
      return res.status(400).send("post doesn't exist");
    }
    post.deleteOne();
    return res.send("post deleted");
  });
});

router.patch("/:id", (req, res) => {
  if (!ObjectID.isValid(req.params._id)) {
    res.status(404).send();
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
