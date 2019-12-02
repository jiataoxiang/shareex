const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { isAuth, isAuthorizedUser, isAdmin } = require('../middleware/auth');
const { ObjectID } = require('mongodb');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users route');
});

// check isAuthenticated
router.get('/check-auth', isAuth, (req, res) => {
  res.send('Is Authenticated.');
});

// check isAuthorizedUser
router.get('/:user_id/check-authorized', isAuth, isAuthorizedUser, (req, res) => {
  res.send('Is Authenticated and Authorized.');
});

// search for user by keywords, return a list of users
router.get('/search/:keyword', (req, res) => {
  const filter =
    req.params.keyword !== 'undefined'
      ? { username: { $regex: `${req.params.keyword}`, $options: 'i' } }
      : {};
  filter.admin = { $ne: true };
  console.log(filter);
  User.find(filter)
    .limit(100)
    .select('username')
    .select('avatar')
    .select('email')
    .then(users => {
      console.log(users);
      res.json({ users });
    })
    .catch(error => {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    });
});

// register
router.post('/', (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, password, email);
  // Make sure all inputs are filled in
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  if (password.length < 4) {
    return res.status(400).json({ message: 'Password must be longer than 4 characters' });
  }
  User.findOne({ username }).then(user => {
    if (user) return res.status(400).json({ message: 'User already exists' });
  });

  const hour = 3600;
  User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  })
    .then(user => {
      console.log('user created: ', user);
      jwt.sign(
        { id: user._id },
        config.get('jwtSecret'),
        {
          expiresIn: 12 * hour,
        },
        (err, token) => {
          if (err) throw err;
          user = user.toObject();
          delete user.password; // prevent sending hashed password to frontend
          res.json({
            token,
            user,
          });
        },
      );
    })
    .catch(err => {
      console.log('error when registering user: ', err);
      res.status(400).json({ message: err.message });
    });
});

// login
router.post('/login', (req, res) => {
  const hour = 3600;
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  try {
    User.findOne({
      username: username,
    }).then(user => {
      if (!user) return res.status(400).json({ message: 'User Does not exist' });
      user.comparePassword(password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          jwt.sign(
            { id: user._id },
            config.get('jwtSecret'),
            {
              expiresIn: hour * 12,
            },
            (err, token) => {
              if (err) throw err;
              user = user.toObject();
              console.log('user: ', user);

              delete user.password; // prevent sending hashed password to frontend
              console.log('user: ', user);
              res.json({
                token,
                user,
                message: 'Authenticated',
              });
            },
          );
        } else {
          return res.status(400).json({ message: 'The password is invalid' });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a user
router.delete('/:user_id', isAuth, isAuthorizedUser, (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      console.log('delete user: ', err);
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: "post doesn't exist}" });
    }
    user.remove().catch(err => {
      return res.status(500).json({ message: err.message });
    });

    // req.flash("success", "Your account has been deleted.");
    // req.logout();
    // return res.redirect("/");
    return res.json({ message: 'user deleted' });
  });
});

// return user info without password, given it's logged in and token is provided and not expired
router.get('/auth', isAuth, (req, res) => {
  // console.log('check', req.user);
  User.findById(req.user.id)
    .select('-password')
    .then(user => {
      res.json(user);
    });
});

//get user by id without sending back password.
// getting user info, no password sent back, no need to check is authorized
router.get('/:user_id', isAuth, (req, res) => {
  const user_id = req.params.user_id;
  if (!ObjectID.isValid(user_id)) {
    res.status(404).send();
  }

  User.findById(user_id)
    .select('-password')
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//get user by username without sending back password.
// getting user info, no password sent back, no need to check is authorized
router.get('/username/:username', isAuth, (req, res) => {
  const username = req.params.username;

  User.find({ username: username })
    .select('-password')
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//add following
router.post('/add-following/:id', isAuth, (req, res) => {
  const id = req.params.id;
  const following_id = req.body.following_id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send('user id is invalid');
  }

  User.findByIdAndUpdate(id, { $push: { following: following_id } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).send('user not found when add following');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//add follow
router.post('/add-follower/:id', isAuth, (req, res) => {
  const id = req.params.id;
  const follower_id = req.body.follower_id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send('user id is invalid');
  }

  User.findByIdAndUpdate(id, { $push: { followers: follower_id } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).send('user is not found!');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//remove follower
router.post('/remove-follower/:id', (req, res) => {
  const id = req.params.id;
  const follower_id = req.body.follower_id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send('user id is invalid');
  }

  User.findByIdAndUpdate(id, { $pull: { followers: follower_id } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).send('user is not found!');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

//remove following
router.post('/remove-following/:id', (req, res) => {
  const id = req.params.id;
  const following_id = req.body.following_id;

  if (!ObjectID.isValid(id)) {
    res.status(404).send('user id is invalid');
  }

  User.findByIdAndUpdate(id, { $pull: { following: following_id } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).send('user is not found');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

router.patch('/:user_id/add-view-history', isAuth, isAuthorizedUser, (req, res) => {
  if (!req.body.post_id) {
    return res.status(400).send('post id DNE');
  }
  if (!ObjectID.isValid(req.body.post_id)) return res.status(400).send('post id not valid');

  User.findById(req.params.user_id).then(user => {
    if (!user) return res.status(404).send('User not found!');
    user.view_history = user.view_history.filter(post_id => post_id !== req.body.post_id);
    user.view_history.unshift(req.body.post_id);
    user
      .save()
      .then(user => {
        res.send(`Successfully added ${req.body.post_id} to view history.`);
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
});

router.patch('/:user_id/remove-view-history', isAuth, isAuthorizedUser, (req, res) => {
  console.log('removing view history');
  User.findByIdAndUpdate(req.params.user_id, {
    view_history: [],
  })
    .then(user => {
      if (!user) return res.status(404).send('User not found!');
      res.json({ message: 'Successfully Removed View History', user_view_history: [] });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

//router.patch('/:user_id', isAuth, isAuthorizedUser, (req, res) => {
//  User.findByIdAndUpdate(req.params.user_id, req.body)
//    .then(user => {
//      if (!user) {
//        res.status(404).send('User not found');
//      }
//      res.send('Successfully updated');
//    })
//    .catch(err => {
//      res.status(500).send(err);
//    });
//});

router.patch('/:user_id', isAuth, isAuthorizedUser, (req, res) => {
  User.findById(req.params.user_id)
    .then(user => {
      if (!user) {
        res.status(404).send('User not found');
      } else {
        Object.keys(req.body).forEach(ele => {
          user[ele] = req.body[ele];
        });
        user.save().then(result => {
          res.send(result);
        });
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.patch('/ban/:user_id', isAuth, isAdmin, (req, res) => {
  console.log('Banning user');
  console.log(req.params.user_id);
  console.log(req.body);

  User.findById(req.params.user_id)
    .then(user => {
      if (!user) {
        res.status(404).send('User not found');
      }
      Object.keys(req.body).forEach(ele => {
        user[ele] = req.body[ele];
      });
      console.log(user);
      user
        .save()
        .then(user => {
          return res.send(user);
        })
        .catch(err => {
          console.log('err at saving user:\n', err);
          res.status(500).send('err');
        });
      // res.status(200).send('end');
    })
    .catch(err => {
      console.log('\nerror: \n');
      console.log(err.message);
      console.log(err.response);
      res.status(500).send(err);
    });
});

//add messenger info to user
router.post('/add-messenger/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send('user id is invalid');
  }

  const message = {
    content: req.body.content,
    messenger_id: req.body.messenger_id,
  };

  User.findByIdAndUpdate(id, { $push: { messages: message } }, { new: true })
    .then(user => {
      if (!user) {
        res.status(404).send('user is not found');
      }
      res.send(user);
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

router.patch("/like/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send("user id is not valid")
  }
  User.findById(id).then(user => {
    user.likes += 1;
    user.save().then(new_user => {
      res.send(new_user)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }).catch(err => {
    res.status(400).send(err)
  })
});

router.patch("/unlike/:id", (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send("user id is not valid")
  }
  User.findById(id).then(user => {
    user.likes -= 1;
    user.save().then(new_user => {
      res.send(new_user)
    }).catch((err) => {
      res.status(400).send(err)
    })
  }).catch(err => {
    res.status(400).send(err)
  })
});

module.exports = router;
