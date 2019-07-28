'use strict';

const TimestampStatusService = require('../services/TimestampStatusService');

/**
 * Gets the current timestamp
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2018
 */
module.exports.getTimestamp = function getTimestamp(req, res, next) {
  let timestampStatusService = new TimestampStatusService();
  timestampStatusService.getTimestamp(req.swagger.params, res, next);
};