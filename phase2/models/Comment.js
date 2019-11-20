const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: String, required: true },
  post_id: { type: String, required: true },
  body: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Comment", CommentSchema);
