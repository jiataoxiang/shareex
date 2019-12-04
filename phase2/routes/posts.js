const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { ObjectID } = require('mongodb');
const Attachment = require('../models/Attachment');
const { isAuth, isAuthorizedPost, isAdmin, isAdminTolerant } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// setup file upload system
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// delete file from cloudinary
const deleteImage = public_id => {
  cloudinary.uploader
    .destroy(public_id)
    .then()
    .catch(err => {
      console.log('No such image in cloudinary');
    });
};

// call with query to add a filter, see post_test for an example
router.get('/', isAuth, isAdminTolerant, (req, res) => {
  let filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  const { search_content } = req.query;
  if (search_content) {
    filter.title = { $regex: `${search_content}`, $options: 'i' };
  }
  if (!req.user.admin) {
    filter.hidden = false;
  } // if not admin, hidden posts will not be displayed
  console.log(req.query.sort_by);
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

// get all posts by keyword
router.get('/search/:keyword', isAuth, (req, res) => {
  const filter =
    req.params.keyword !== 'undefined'
      ? { title: { $regex: `${req.params.keyword}`, $options: 'i' } }
      : {};
  Post.find(filter)
    .sort({ created_at: -1 })
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

// get recommendaed posts
router.get('/recommendations', isAuth, (req, res) => {
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

// get the number of posts
router.get('/countposts', isAuth, isAdmin, (req, res) => {
  Post.count()
    .then(count => {
      res.send({ count: count });
    })
    .catch(err => {
      res.status(500).send();
    });
});

router.get('/countdaily', isAuth, isAdmin, (req, res) => {
  var yesterday = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

  Post.find({
    created_at: { $gt: yesterday },
  })
    .then(posts => {
      if (!posts) {
        res.status(404).send();
      } else {
        res.send({ count: posts.length });
      }
    })
    .catch(err => {
      res.status(500).send();
    });
});

// get posts by user id
router.get('/by-user/:user_id', isAuth, isAdminTolerant, (req, res) => {
  const filter = { author: req.params.user_id };
  if (!req.user.admin) {
    filter.hidden = false;
  } // if not admin, hidden posts will not be displayed

  Post.find(filter)
    .sort({ created_at: -1 })
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

// get user's favourite posts
router.get('/post-array', isAuth, isAdminTolerant, (req, res) => {
  if (!req.query.posts) return res.send([]);
  const posts = req.query.posts.filter(post => ObjectID.isValid(post));
  const filter = {
    _id: { $in: posts },
  };
  if (!req.user.admin) {
    filter.hidden = false;
  } // if not admin, hidden posts will not be displayed
  Post.find(filter)
    .then(posts => {
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

// helper function to add attachments of a post to the database
make_post_helper = (attachments, post) => {
  return new Promise((resolve, reject) => {
    const ans = [];
    attachments.forEach(async attachment => {
      const new_attachment = new Attachment({
        type: attachment.type,
        body: attachment.body,
        post_id: post._id,
      });
      new_attachment.save();
      ans.push(new_attachment._id);
    });
    resolve(ans);
  });
};

// delete a post by id
router.delete('/:id', isAuth, isAuthorizedPost, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('post id not valid');
  }
  Post.findById(req.params.id)
    .then(post => {
      post.attachments.forEach(e => {
        Attachment.findById(e)
          .then(attach => {
            if (attach.type === 'image' || attach.type === 'pdf') {
              const url = attach.body;
              const words = url.split('.');
              const public_key = words[words.length - 2].split('/').reverse()[0];
              deleteImage(public_key);
            }
          })
          .catch(err => {
            res.status(500).send('find attachment failed.');
          });
      });

      if (!post) {
        return res.status(400).send("post doesn't exist");
      }
      post.remove();
      return res.send('post deleted');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('post not deleted');
    });
});

// delete a post by id
router.delete('/permdelete/:id', isAuth, isAdmin, (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(404).send('post id not valid');
  }
  Post.findById(req.params.id)
    .then(post => {
      post.attachments.forEach(e => {
        Attachment.findById(e)
          .then(attach => {
            if (attach.type === 'image' || attach.type === 'pdf') {
              const url = attach.body;
              const words = url.split('.');
              const public_key = words[words.length - 2].split('/').reverse()[0];
              deleteImage(public_key);
            }
          })
          .catch(err => {
            res.status(500).send('find attachment failed.');
          });
      });

      if (!post) {
        return res.status(400).send("post doesn't exist");
      }
      post.remove();
      return res.send('post deleted');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('post not deleted');
    });
});

// get post by user id
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

// update fav number by post id
router.patch('/remove-fav/:post_id', isAuth, (req, res) => {
  User.findByIdAndUpdate(req.body.user_id, {
    $pull: { favs: req.params.post_id },
  })
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

// update a post content by post id
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

// update a part of a post
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
      res.json({ attachments: attachments });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

module.exports = router;
