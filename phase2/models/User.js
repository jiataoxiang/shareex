const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  admin: Boolean,
  created_at: { type: Date, default: Date.now },
  followers: { type: Array, default: [] },
  following: { type: Array, default: [] },
  banned: { type: Boolean, default: false },
  unbanned_date: { type: Date, default: null }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("User", userSchema);
