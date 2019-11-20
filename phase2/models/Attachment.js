const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttachmentSchema = new Schema({
  type: { type: String, default: "text" },
  body: { type: String, default: "body" },
  post_id: { type: String, required: true }
});

module.exports = mongoose.model("Attachment", AttachmentSchema);
