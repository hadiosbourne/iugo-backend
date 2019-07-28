'use strict';

const LeaderboardService = require('../services/LeaderboardService');

/**
 * returns leader board score ranking
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.getLeaderboard = function getLeaderboard(req, res, next) {
  let leaderboardService = new LeaderboardService();
  leaderboardService.getLeaderboard(req, res, next);
};