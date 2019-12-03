const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { ObjectID } = require('mongodb');
const Attachment = require('../models/Attachment');
const { isAuth, isAuthorizedPost, isAdmin } = require('../middleware/auth');

// call with query to add a filter, see post_test for an example
router.get('/', (req, res) => {
  console.log(
    '\n\n\n\nSort By: ',
    req.query.sort_by,
    '\nCategory: ',
    req.query.category,
    '\n\n\n\n',
  );

  let filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const { search_content } = req.query;
  console.log('\n\nsearch content: ', search_content);
  if (search_content) {
    console.log('search content: ', search_content);
    filter.title = { $regex: `${search_content}`, $options: 'i' };
  }
  console.log(filter);

  Post.find(filter)
    .sort({ [req.query.sort_by]: -1 })
    // .sort({ likes: -1 })
    .limit(100)
    .then(
      posts => {
        res.json({ posts }); // can wrap in object if want to add more properties
      },
      error => {
        res.status(500).send(error); // server error
      },
    );
});

router.get('/search/:keyword', (req, res) => {
  console.log('keyword: ' + req.params.keyword);
  console.log('keyword: ', typeof req.params.keyword);
  const filter =
    req.params.keyword !== 'undefined'
      ? { title: { $regex: `${req.params.keyword}`, $options: 'i' } }
      : {};
  console.log(filter);
  Post.find(filter)
    .sort({ created_at: -1 })
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

router.get('/recommendations', (req, res) => {
  Post.find({})
    .sort({ created_at: -1, views: -1 })
    .limit(10)
    .then(posts => {
      res.send(posts);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

// get posts by user id
router.get('/by-user/:user_id', isAuth, (req, res) => {
  Post.find({ author: req.params.user_id })
    .sort({ created_at: -1 })
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

// get user's favourite posts
router.get('/post-array', (req, res) => {
  if (!req.query.posts) return res.send([]);
  const posts = req.query.posts.filter(post => ObjectID.isValid(post));
  Post.find({
    _id: { $in: posts },
  })
    .then(posts => {
      console.log(posts);
      res.send(posts.reverse());
    })
    .catch(err => {
      console.log('debug: ', err.message);
      res.status(500).send(err);
    });
});

// get a post by id
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // console.log("In serverside post.jsx: ", post);
      if (post) {
        return res.send(post);
      }
      res.status(404).send('Post Not Found');
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// update a post
router.patch('/update-post/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    res.status(404).send('post id not valid');
  }

  const the_post = {
    _id: req.params.id,
  };
  make_post_helper(req.body.attachments, the_post)
    .then(attach_list => {
      const updated_post = {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        body: req.body.body,
      };
      updated_post.attachments = attach_list;

      console.log('Post to to updated after is like: ', updated_post);
      Post.findByIdAndUpdate(req.params.id, { $set: updated_post }, { new: true })
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
    })
    .catch(err => {
      return res.status(500).send(err);
    });
});

// make a new post
router.post('/', isAuth, async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      body: req.body.body,
    });
    if (!req.body.attachments) {
      return res.json({
        message: 'Post Created, No Attachments.',
        post,
      });
    }

    make_post_helper(req.body.attachments, post).then(attach_list => {
      post.attachments = attach_list;
      post.save();
      res.json({
        post,
        message: 'Post created',
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

make_post_helper = (attachments, post) => {
  return new Promise((resolve, reject) => {
    const ans = [];
    attachments.forEach(async attachment => {
      console.log(
        'Before create()>>>>>>>>> >>>>>>>>> >>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>> >>>>>>>>>>>>>>>>>>',
      );
      const new_attachment = new Attachment({
        type: attachment.type,
        body: attachment.body,
        post_id: post._id,
      });
      new_attachment.save();
      console.log(
        'After save()>>>>>>>>> >>>>>>>>> >>>>>>>>> >>>>>>>>>>>>>>>>>>>>>>>>>>> >>>>>>>>> >>>>>>>>>>>>>>>>>>',
      );
      ans.push(new_attachment._id);
    });
    resolve(ans);
  });
};

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

router.get('/user-posts/:user_id', isAuth, (req, res) => {
  const user_id = req.params.user_id;
  if (!ObjectID.isValid(user_id)) {
    res.status(404).send('user id is not valid');
  }

  Post.find()
    .then(posts => {
      const posts_for_user = posts.filter(post => post.author === user_id);
      if (posts_for_user.length === 0) {
        res.send([]);
      } else {
        res.send(posts_for_user);
      }
    })
    .catch(error => {
      res.status(500).send(error + 'Holy!!!');
    });
});

// add like
router.patch('/like/:post_id', isAuth, (req, res) => {
  console.log('Liking post');
  if (!ObjectID.isValid(req.params.post_id)) {
    return res.status(404).json({ message: 'post id not valid' });
  }
  Post.findById(req.params.post_id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: 'Post not found, and cannot update' });
      }
      // check if user has liked this post
      User.findById(req.user.id).then(user => {
        if (!user.admin) {
          // if user is admin, can skip and
          if (post.likes_users) {
            if (post.likes_users.includes(req.user.id)) {
              return res.status(403).json({ message: 'You have liked the post' });
            }
          }
        }
        // in case user doesn't have the array in earlier schema design

        if (!post.likes_users) {
          post.likes_users = [];
        }

        // in case admin got pushed many times into array
        if (!post.likes_users.includes(req.user.id)) {
          post.likes_users.push(req.user.id);
        }

        post.likes++;

        post.save().then(new_post => {
          return res.json({ post });
        });
      });
    })
    .catch(error => {
      res.status(400).json({ message: 'Post not updated, bad request' }); // bad request for changing the post.
    });
});

// unlike a post
router.patch('/unlike/:post_id', isAuth, (req, res) => {
  console.log('Unliking post');
  if (!ObjectID.isValid(req.params.post_id)) {
    return res.status(404).json({ message: 'post id not valid' });
  }
  Post.findById(req.params.post_id).then(post => {
    if (!post) {
      return res.status(404).json({ message: 'Post not found, and cannot update' });
    }
    // check if user has liked this post
    User.findById(req.user.id).then(user => {
      if (!user.admin) {
        // if user is admin, can skip and
        if (post.likes_users) {
          if (!post.likes_users.includes(req.user.id)) {
            return res.status(403).json({ message: 'You have not liked the post' });
          }
        }
      }
      // in case user doesn't have the array in earlier schema design
      if (!post.likes_users) {
        post.likes_users = [];
      }
      // remove the user from the likes_users array
      post.likes_users = post.likes_users.filter(user_id => user_id !== req.user.id);

      post.likes--;
      post.save().then(new_post => {
        return res.json({ post });
      });
    });
  });
});

// add favorite
router.patch('/add-fav', isAuth, (req, res) => {
  console.log(req.body);
  if (!ObjectID.isValid(req.body.post_id)) {
    return res.status(400).send('Post Id Not valid');
  }
  User.findById(req.body.user_id).then(user => {
    if (!user) return res.status(404).send('User not found');
    if (user.favs.includes(req.body.post_id))
      return res.status(403).send('Already favored this post');
    user.favs.push(req.body.post_id);
    user
      .save()
      .then(user => {
        Post.findByIdAndUpdate(req.body.post_id, { $inc: { favs: 1 } })
          .then(post => {
            res.send('Added to favs of user and increment favs of post');
          })
          .catch(err => {
            res.stats(500).send(err);
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).send(err);
      });
  });
});

router.patch('/remove-fav/:post_id', isAuth, (req, res) => {
  User.findByIdAndUpdate(req.body.user_id, { $pull: { favs: req.params.post_id } })
    .then(user => {
      Post.findByIdAndUpdate(req.params.post_id, { $inc: { favs: -1 } })
        .then(post => {
          res.send('updated, removed favs');
        })
        .catch(err => {
          console.log(err);
          res.status(500).send(err);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

router.patch('/:id', isAuth, (req, res) => {
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

router.patch('/delete/:id', isAuth, isAdmin, (req, res) => {
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

// get attachments of given post
router.get('/:post_id/attachments', (req, res) => {
  Attachment.find({ post_id: req.params.post_id })
    .sort({ _id: -1 })
    .then(attachments => {
      // console.log("In the serverside post.js: ", attachments);
      res.json({ attachments: attachments });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
