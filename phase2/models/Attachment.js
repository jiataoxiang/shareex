const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
  type: String,
  bpdy: String,
  post_id: String
});

module.exports = mongoose.model("Attachment", attachmentSchema);
