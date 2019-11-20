const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  body: { type: String, required: true },
  link: { type: String },
  type: { type: String, default: "" },
  created_at: { type: Date, default: Date.now() },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", notificationSchema);
