const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  body: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  delete_date: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  favs: { type: Number, default: 0 },
  attachments: { type: Array, default: [] }
});

module.exports = mongoose.model("Post", postSchema);
