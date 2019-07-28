'use strict';

const TransactionService = require('../services/TransactionService');

/**
 * Logs the user transaction
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.postUserTransaction = function postUserTransaction(req, res, next) {
  let transactionService = new TransactionService();
  transactionService.postUserTransaction(req, res, next);
};

/**
 * Returns the user transaction stats
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.postUserTransactionStats = function postUserTransactionStats(req, res, next) {
  let transactionService = new TransactionService();
  transactionService.postUserTransactionStats(req, res, next);
};