'use strict';
const {Transaction} = require('../models');
const _ = require('lodash');
const config = require('config');
const secretKey = config.get('secret_key');
const crypto = require('crypto');
const async = require('async');

/**
 * Create an instance of the User Transaction service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
class TransactionService {

  constructor() {}

  /**
   * Logs User Transaction
   *
   * @param {object} swaggerParams - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  postUserTransaction(req, res, next) {
    let payload = req.swagger.params.Transaction.value;
    async.parallel({
      findOneTransactionRecord: async.apply(_findOneTransactionRecord, {'TransactionId': payload['TransactionId']}),
      validateVerifier: async.apply(_validateVerifier, payload)
    }, (err) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }
      _saveTransaction(payload, (saveError)=>{
        if (saveError) {
          res.status(saveError.code).json(saveError.message);
          return next();
        }
        let responseObject = {
          'Success': true
        };
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(responseObject));
      });
    });
  }

  /**
   * Returns number of unique transactions and the total sum of currency logged for a specific UserId
   *
   * @param {object} swaggerParams - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  postUserTransactionStats(req, res, next) {
    let userId = req.swagger.params.TransactionStats.value['UserId'];
    async.parallel({
      findTransactionRecords: async.apply(_findTransactionRecords, {'UserId': userId}),
      countTransactionRecord: async.apply(_countTransactionRecord, {'UserId': userId})
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }

      let finalResult = _buildFinalResponse(userId, results['findTransactionRecords'], results['countTransactionRecord']);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(finalResult));
    });
  }
}

module.exports = TransactionService;

/**
 * Saves the transaction record
 *
 * @param {object} payload - The payload object
 * @param {string} transactionRecord - The callback
 * @param {string} transactionCount - The callback

 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _saveTransaction(payload, callback) {
  let userTransaction = new Transaction(payload);
  userTransaction.save((err, result) => {
    if (err) {
      let error = {
        code: 500,
        message: {
          'Error': true,
          'ErrorMessage': 'unexpected error happened when saving the Transaction record ' + err
        }
      };
      return callback(error);
    }
    return callback(null, result);
  });
}

/**
 * Builds up the final response to be returned by the postUserTransactionStats route
 *
 * @param {string} userId - The  userId
 * @param {array} transactionRecord - The transactionRecord
 * @param {string} transactionCount - The transactionRecord

 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return object
 */
function _buildFinalResponse(userId, transactionRecord, transactionCount) {
  let currencySum = 0;
  transactionRecord.forEach(element => {
    currencySum = currencySum + element['CurrencyAmount']
  });
  return {
    'UserId': userId,
    'TransactionCount': transactionCount,
    'CurrencySum': currencySum
  };
}

/**
 * validates the verifies string
 *
 * @param {object} payload - The payload object
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _validateVerifier(payload, callback) {
  let hashValue = crypto.createHash('sha1')
    .update(secretKey + payload['TransactionId'] +  payload['UserId'], payload['CurrencyAmount'])
    .digest('hex');
  if(payload['Verifier'] !== hashValue) {
    let error = {
      code: 400,
      message: {
        'Error': true,
        'ErrorMessage': 'validation error, the verifier string is invalid'
      }
    };
    return callback(error);
  }
  return callback();
}

/**
 * Get the Transaction record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _findOneTransactionRecord(query, callback) {
  Transaction.findOne(query, (err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: {
          'Error': true,
          'ErrorMessage': 'An error occurred while retrieving Transaction' + err
        }
      };
      return callback(error);
    }
    if(!_.isEmpty(res)) {
      let duplicationError = {
        code: 400,
        message: {
          'Error': true,
          'ErrorMessage': 'The transaction has already been submited for TransactionId'
        }
      };
      return callback(duplicationError);
    }
    return callback(null, res);
  })
}

/**
 * Get the Transaction record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _countTransactionRecord(query, callback) {
  Transaction.count(query, (err, res)=>{
    if(err) {
      let error = {
        code: 500,
        message: {
          'Error': true,
          'ErrorMessage': 'An error occurred while retrieving the count of Transaction' + err
        }
      };
      return callback(error);
    }
    return callback(null, res);
  })
}

/**
 * Get the Transaction record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _findTransactionRecords(query, callback) {
  //We could add suport for pagination here
  Transaction.find(query)
  .exec((err, results) => {
    if (err) {
      let error = {
        code: 500,
        message: {
          'Error': true,
          'ErrorMessage': 'An error occurred while retrieving Transaction record list' + err
        }
      };
      return callback(error);
    }
    if (_.isEmpty(results)) {
      let resourceNotFound = {
        code: 404,
        message: {
          'Error': true,
          'ErrorMessage': 'No resource found for user'
        }
      };
      return callback(resourceNotFound);
    }
    return callback(null, results);
  });
}