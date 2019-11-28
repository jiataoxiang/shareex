const config = require('config');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');

// how to check how much time is left until expiration?
// get expiration time, times it by 1000
// exp * 1000 - Date.now() = number of milli-seconds left
// (exp * 1000 - Date.now()) / 1000 = number of seconds left
// (exp * 1000 - Date.now()) / 1000 / 60 = number of minutes left

function isAuth(req, res, next) {
  const token = req.header('x-auth-token');

  // check for token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied!' });
  }
  try {
    // verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
}

// assume isAuth is called before this, since req.user.id is needed
function isAuthorizedPost(req, res, next) {
  const post_id = req.params.id;
  const user_id = req.user.id;
  Post.findById(post_id)
    .then(post => {
      if (!post) {
        return res.status(404).json({ message: "Post doesn't exist" });
      }
      if (post._id.toString() === user_id) {
        next();
      } else {
        return res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      return res.status(500).json({ message: error });
    });
}

/* check if the user id in req.params is current user
assume isAuth is called before this middleware since req.user is needed to check current user (token)
assume :id in route url is user id, otherwise won't work
login as admin user could bypass this check
if is admin, req.user.admin will be set to true
*/
function isAuthorizedUser(req, res, next) {
  console.log(req.user.id);
  User.findById(req.user.id)
    .then(user => {
      console.log(user);
      if (!user) res.status(404).send('user not found');
      if (user.admin) {
        req.user.admin = true;
      }
      if (!user.admin) {
        // if not admin, check if this action is made by same user
        if (req.params.user_id !== req.user.id) {
          res.status(401).send('Unauthorized action');
        }
      }
      // if reached this line, current user is either admin or the same user as in params.id(authorized)
      next();
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

// check if current user is admin
// assume isAuth is called before this middleware since req.user is needed to check current user (token)
function isAdmin(req, res, next) {
  User.findById(req.user.id).then(user => {
    if (user.admin) return next();
    else res.status(401).send('Unauthorized.');
  });
}

module.exports = {
  isAuth: isAuth,
  isAuthorizedPost: isAuthorizedPost,
  isAuthorizedUser: isAuthorizedUser
};
