const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { ObjectID } = require('mongodb');
const Attachment = require('../models/Attachment');

// call with query to add a filter, see post_test.js for a similar example
router.get('/', (req, res) => {
  let filter = {};
  if (req.query.post_id) {
    filter.post_id = req.query.post_id;
  }
  // sorted by date, from latest to oldest
  const order = 'desc'; // replace with "asc for ascending order"
  Comment.find(filter)
    .sort({ created_at: order })
    .then(
      comments => {
        res.json({ comments }); // can wrap in object if want to add more properties
      },
      error => {
        res.status(500).json({ message: error }); // server error
      }
    );
});

// create a comment
router.post('/', (req, res) => {
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
      res.status(400).json({ message: 'bad request' });
    });
});

router.delete('/:id', (req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then(comment => {
      if (!comment) {
        console.log("comment doesn't exist");
        res.status(404).json({ message: "comment doesn't exist" });
      }
      res.json({ msg: 'comment deleted', data: comment });
    })
    .catch(err => {
      res
        .status(400)
        .json({ message: 'comment not deleted, error, bad request' });
    });
});

router.patch('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(404).json({ message: 'comment id not valid' });
  }

  Comment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(comment => {
      if (!comment) {
        res
          .status(404)
          .json({ message: 'Comment not found, and cannot update' });
      } else {
        res.send(post);
      }
    })
    .catch(error => {
      res.status(400).json({ message: 'Comment not updated, bad request' }); // bad request for changing the post.
    });
});

module.exports = router;