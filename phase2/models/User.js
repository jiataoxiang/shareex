const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: String,
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date,
  followers: Array
});

module.exports = mongoose.model("User", userSchema);
