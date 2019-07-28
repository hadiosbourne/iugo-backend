'use strict';
const {Transaction} = require('../models');
const _ = require('lodash');
const config = require('config');
const secretKey = config.get('secret_key');
const crypto = require('crypto');

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
    _findOneTransactionRecord({'TransactionId': payload['TransactionId']}, (findError, findRecord)=>{
      if(findError) {
        return next(findError);
      }
      if(!_.isEmpty(findRecord)) {
        let duplicationError = {
          'Error': true,
          'ErrorMessage': 'The transaction has already been submited for TransactionId: ' + payload['TransactionId']
        };
        return next(duplicationError);
      }
      _validateVerifier(payload, (validationError)=>{
        if(validationError) {
          return next(validationError);
        }
        let userTransaction = new Transaction(payload);
        userTransaction.save((err, result) => {
          if (err) {
            let runTimeError = {
              'Error': true,
              'ErrorMessage': 'unexpected error happened when saving the Transaction record ' + err
            };
            return next(runTimeError);
          }
          console.log(result);
          let responseObject = {
            'Success': true
          };
          res.statusCode = 201;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(responseObject));
        });
      });
    })
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
    _findTransactionRecords({'UserId': userId}, (err, transactionRecord)=>{
      if (err) {
        return next(err);
      }
      if (_.isEmpty(transactionRecord)) {
        let resourceNotFound = {
          'Error': true,
          'ErrorMessage': 'No resource found for user with id: ' + userId
        };
        return callback(resourceNotFound);
      }
      _countTransactionRecord({'UserId': userId}, (countError, countRecord)=>{
        if(countError) {
          return callback(countError);
        }
        let currencySum = 0;
        transactionRecord.forEach(element => {
          currencySum = currencySum + element['CurrencyAmount']
        });
        let finalResult = {
          'UserId': userId,
          'TransactionCount': countRecord,
          'CurrencySum': currencySum
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(finalResult));
      });
    })
  }
}

module.exports = TransactionService;


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
  console.log(hashValue);
  if(payload['Verifier'] !== hashValue) {
    let error = {
      'Error': true,
      'ErrorMessage': 'validation error, the verifier string is invalid'
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
      let runtimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving Transaction' + err
      };
      return callback(runtimeError);
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
      let runtimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving the count of Transaction' + err
      };
      return callback(runtimeError);
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
      let runtimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving Transaction record list' + err
      };
      return callback(runtimeError);
    }
    return callback(null, results);
  });
}