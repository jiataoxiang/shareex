const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { isAuth } = require('../middleware/auth');
const {ObjectID} = require("mongodb");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// register
router.post('/', (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, password, email);
  // Make sure all inputs are filled in
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  User.findOne({ username }).then(user => {
    if (user) return res.status(400).json({ message: 'User already exists' });
  });

  const hour = 3600;
  User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })
    .then(user => {
      console.log('user created: ', user);
      jwt.sign(
        { id: user._id },
        config.get('jwtSecret'),
        {
          expiresIn: 1 * hour
        },
        (err, token) => {
          if (err) throw err;
          user = user.toObject();
          delete user.password; // prevent sending hashed password to frontend
          res.json({
            token,
            user
          });
        }
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
      username: username
    }).then(user => {
      if (!user)
        return res.status(400).json({ message: 'User Does not exist' });
      user.comparePassword(password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          jwt.sign(
            { id: user._id },
            config.get('jwtSecret'),
            {
              expiresIn: hour * 1
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
                message: 'Authenticated'
              });
            }
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

router.delete('/:id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
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

//get user by id without password.
router.get("/:user_id", isAuth, (req, res) => {
  const user_id = req.params.user_id;
  if(!ObjectID.isValid(user_id)) {
    res.status(404).send()
  }

  User.findById(user_id)
    .select("-password")
    .then((user)=> {
      res.json(user)
  }).catch((error) => {
    res.status(400).send(error)
  })
});

module.exports = router;
