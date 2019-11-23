const config = require('config');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

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

module.exports = {
  isAuth: isAuth,
  isAuthorizedPost: isAuthorizedPost
};
