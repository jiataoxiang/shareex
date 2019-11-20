const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Post = require("./Post");
const Attachment = require("./Attachment");
const Comment = require("./Comment");
const Notification = require("./Notification");
const validator = require("validator");

const UserSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Not Valid Email"
    }
  },
  admin: Boolean,
  created_at: { type: Date, default: Date.now },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  banned: { type: Boolean, default: false },
  unbanned_date: { type: Date, default: null }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.pre("save", function(next) {
  console.log("pre save for user called\n\n");
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }
});

UserSchema.pre("remove", function(next) {
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

module.exports = mongoose.model("User", UserSchema);
