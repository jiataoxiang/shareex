const User = require("../models/User");
const Post = require("../models/Post");
const Attachment = require("../models/Attachment");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const bcrypt = require("bcrypt");
require("../util/mongoose_connection"); // this line with connect to database
User.remove({ username: "seed_user" }, err => {
  if (err) {
    console.log(err);
  }
});

User.create({
  username: "seed_user",
  password: "seed_user_password"
}).then(user => {
  console.log("user created: \n", user);
  Post.create({
    title: "seed_post1",
    author: user._id,
    category: "seed",
    body: "seed_post1_body"
  }).then(post => {
    console.log("post created: \n", post);
    Comment.create({
      author: user._id,
      post_id: post._id,
      body: "seed_comment1_body"
    }).then(comment => {
      console.log("comment created: \n", comment);
    });
    console.log("attachment created: \n", post);
    Attachment.create({
      type: "text",
      body: "attachment body",
      post_id: post._id
    }).then(attachment => {
      console.log("attachment created: \n", attachment);
    });
  });
  Post.create({
    title: "seed_post2",
    author: user._id,
    category: "seed",
    body: "seed_post2_body"
  });
  Notification.create({
    from: "placeholder",
    to: user._id,
    body: "random body"
  });
});
