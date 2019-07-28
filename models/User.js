'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    UserId: {
      type: Number,
      required: true
    },
    Data: {
      type: Object,
      required: true
    }
  },
  {
    collection: 'User'
  }
);

module.exports = mongoose.model('User', UserSchema);
