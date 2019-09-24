const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true
  },
  description: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
    maxlength: 10
  },
  date_created: {
    type: Date,
    required: true,
    default: Date.now()
  },
  status: {
    type: String,
    required: true,
    default: "pending"
  },
  player: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: false
  },
  game_score: {
    type: Number,
    default: 10
  },
  game_life: {
    type: Number,
    default: 20
  }
});

const Games = mongoose.model("Games", gameSchema);

module.exports = Games;
