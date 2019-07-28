'use strict';

const ScoreService = require('../services/ScoreService');

/**
 * returns user score ranking
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.postScore = function postScore(req, res, next) {
  let scoreService = new ScoreService();
  scoreService.postScore(req, res, next);
};