const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 70
  },
  reg_date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  total_score: {
    type: Number,
    required: true,
    default: 0
  }
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
