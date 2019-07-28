'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ScoreSchema = new Schema(
  {
    UserId: {
      type: Number,
      required: true
    },
    LeaderboardId: {
      type: Number,
      required: true
    },
    Score: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'Score'
  }
);

module.exports = mongoose.model('Score', ScoreSchema);
