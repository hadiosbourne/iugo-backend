'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema(
  {
    TransactionId: {
      type: Number,
      required: true
    },
    UserId: {
      type: Number,
      required: true
    },
    CurrencyAmount: {
      type: Number,
      required: true
    },
    Verifier: {
      type: String,
      required: true
    },
  },
  {
    collection: 'Transaction'
  }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
