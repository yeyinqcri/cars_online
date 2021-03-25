const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  file: { type: String, required: true },
});
module.exports = mongoose.model("admin", adminSchema);
