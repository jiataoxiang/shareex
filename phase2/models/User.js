const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Post = require('./Post');
const Attachment = require('./Attachment');
const Comment = require('./Comment');
const Notification = require('./Notification');
const validator = require('validator');

const UserSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true, minlength: 4 },
  password: { type: String, required: true, minlength: 4 },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Not Valid Email'
    }
  },
  gender: { type: String },
  admin: { type: Boolean, required: true, default: 'false' },
  created_at: { type: Date, default: Date.now },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  likes: {type: Array, default: []},
  banned: { type: Boolean, default: false },
  unbanned_date: { type: Date, default: null },
  avatar: {type: String, default: "./img/User_Avatar.png"},
  banner: {type: String, default: "./img/banner.jpg"},
  motto: {type:String, default: "Welcome, new user"}
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.pre('save', function(next) {
  console.log('\n\n-----pre save for user called-----\n\n');
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }
});

UserSchema.pre('remove', function(next) {
  console.log(`removing user ${this._id} and his/her posts`);
  Post.find({ author: this._id }).then(posts => {
    posts.forEach(post => {
      post.remove();
    });
  });
  console.log(`removing user ${this._id} and his/her notifications`);
  // remove all notifications related to the user
  Notification.remove({ $or: [{ to: this._id }, { from: this._id }] }, err => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

module.exports = mongoose.model('User', UserSchema);
