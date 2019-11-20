const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Attachment = require("./Attachment");
const Comment = require("./Comment");

const PostSchema = new Schema({
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

PostSchema.pre("remove", function(next) {
  console.log(`removing post ${this._id} and its comments`);
  Comment.remove({ post_id: this._id }, err => {
    if (err) {
      console.log(err);
    }
  });
  console.log(`removing post ${this._id} and its attachments`);
  Attachment.remove({ post_id: this._id }, err => {
    if (err) {
      console.log(err);
    }
  });
  next();
});

module.exports = mongoose.model("Post", PostSchema);
