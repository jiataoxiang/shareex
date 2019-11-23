const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { ObjectID } = require('mongodb');
const Attachment = require('../models/Attachment');
const { isAuth, isAuthorizedPost } = require('../middleware/auth');

// call with query to add a filter, see post_test for an example
router.get('/', (req, res) => {
  let filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  console.log(filter);
  Post.find(filter).then(
    posts => {
      res.json({ posts }); // can wrap in object if want to add more properties
    },
    error => {
      res.status(500).send(error); // server error
    }
  );
});

router.get('/test-reach', (req, res) => {
  res.send('reached');
});

// get a post by id
router.get('/:id', isAuth, (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        return res.send(post);
      }
      res.status(404).send('Post Not Found');
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// make a new post
router.post('/', isAuth, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      body: req.body.body
    });
    console.log('post created, now attachments\n\n');
    const attachments = [];
    if (!req.body.attachments) {
      return res.json({
        message: 'Post Created, No Attachments.',
        post
      });
    }
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
    res.json({
      post,
      message: 'Post created'
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

router.delete('/:id', isAuth, isAuthorizedPost, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('post id not valid');
  }
  Post.findById(req.params.id)
    .then(post => {
      console.log('deleting post: ', post);
      if (!post) {
        return res.status(400).send("post doesn't exist");
      }
      post.remove();
      return res.send('post deleted');
    })
    .catch(err => {
      console.log(err);
      res.stats(500).send('post not deleted');
    });
});

router.patch('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(404).send('post id not valid');
  }

  Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then(post => {
      if (!post) {
        return res.status(404).send('Post not found, and cannot update');
      } else {
        return res.send(post);
      }
    })
    .catch(error => {
      res.status(400).send('Post not updated, bad request'); // bad request for changing the post.
    });
});

// add like
router.patch('/like/:post_id', isAuth, (req, res) => {
  console.log(req.user);
  if (!ObjectID.isValid(req.params.post_id)) {
    return res.status(404).json({ message: 'post id not valid' });
  }
  Post.findById(req.params.post_id)
    .then(post => {
      console.log(post);
      if (!post) {
        return res
          .status(404)
          .json({ message: 'Post not found, and cannot update' });
      }
      // check if user has liked this post
      if (post.likes_users) {
        if (post.likes_users.includes(req.user.id)) {
          return res.status(403).json({ message: 'You have liked the post' });
        }
      } else {
        post.likes_users = [];
      }
      post.likes_users.push(req.user.id);
      post.likes = post.likes + 1;
      post.save().then(new_post => {
        return res.json({ post });
      });
    })
    .catch(error => {
      res.status(400).json({ message: 'Post not updated, bad request' }); // bad request for changing the post.
    });
});

module.exports = router;
