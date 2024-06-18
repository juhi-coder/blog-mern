const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, minlength: 4 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const userModel = model("User", userSchema);

module.exports = userModel;
