'use strict';

const ResetService = require('../services/ResetService');

/**
 * resets the given database
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.resetDB = function resetDB(req, res, next) {
  let resetService = new ResetService();
  resetService.resetDB(req, res, next);
};