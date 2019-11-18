const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  author: String,
  body: String,
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  likes: Number,
  meta: {
    votes: Number,
    favs: Number
  }
});

module.exports = mongoose.model("Post", postSchema);
