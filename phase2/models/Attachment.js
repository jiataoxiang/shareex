const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attachmentSchema = new Schema({
  type: String,
  content: String
});

module.exports = mongoose.model("Attachment", attachmentSchema);
