'use strict';
const {Score} = require('../models');
const _ = require('lodash');
const {getRank} = require('../helpers/RankHelper');
const async = require('async');

/**
 * Create an instance of the Leaderboard Service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
class LeaderboardService {

  constructor() {}

  /**
   * Retuns leader board score ranking along with the given users score and ranking
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
  getLeaderboard(req, res, next) {
    let payload = req.swagger.params.getLeaderboard.value;
    let leaderBoardId = payload['LeaderboardId'];
    let UserId = payload['UserId'];
    async.parallel({
      findOneScore: async.apply(_findOneScore, {'LeaderboardId': leaderBoardId, 'UserId': UserId}),
      findScoreRecords: async.apply(_findScoreRecords, {'LeaderboardId': leaderBoardId}, payload['Offset'], payload['Limit']),
      getRank: async.apply(getRank, leaderBoardId, UserId)
    }, (err, results) => {
      if (err) {
        res.status(err.code).json(err.message);
        return next();
      }
      let finalResult = _buildupResponse(results['findOneScore'], results['getRank'], results['findScoreRecords']);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(finalResult));
    });
  }

}

module.exports = LeaderboardService;

/**
 * Builds the response
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return responseObject
 */
function _buildupResponse(scoreRecord, rank, findRecord) {
  scoreRecord['Rank'] = rank;
  scoreRecord['Entries'] = findRecord
  return scoreRecord;
}

/**
 * Get the Score record from database
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
function _findOneScore(query, callback) {
  Score.findOne(query, (err, res)=>{
    if(err) {
      let runtimeError = {
        code: 500,
        message: {
          'Error': true,
          'ErrorMessage': 'An error occurred while retrieving Score ' + err
        }
      };
      return callback(runtimeError);
    }
    if(_.isEmpty(res)) {
      let resourceNotFound = {
        code: 404,
        message: {
          'Error': true,
          'ErrorMessage': 'the given UserId does not have value for the given LeaderBoard'
        }
      };
      return callback(resourceNotFound);
    }
    return callback(null, res.toJSON());
  })
}

/**
 * Gets the list of Score records from database and adds their rank at the given leaderboard to them
 *
 * @param {object} query - The query to match
 * @param {object} offset - The offset value
 * @param {object} limit - The limit
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _findScoreRecords(query, offset, limit, callback) {
  Score.aggregate([
    {'$match': query},
    {'$sort': { 'Score': -1 }},
    {'$skip': offset},
    {'$limit': limit}
  ]).exec(function(err, results) {
    if (err) {
      let runtimeError = {
        code: 500,
        message: {
          'Error': true,
          'ErrorMessage': 'An error occurred while retrieving Score records ' + err
        }
      };
      return callback(runtimeError);
    }
    let finalResult = [];
    results.filter((entry)=>{
      getRank(entry['LeaderboardId'], entry['UserId'], (err, rank)=>{
        if(err) {
          let runtimeError = {
            code: 500,
            message: {
              'Error': true,
              'ErrorMessage': 'An error occurred while calculating rank ' + err
            }
          };
          return callback(runtimeError);
        }
        let newRecord = entry;
        newRecord['Rank'] = rank;
        delete newRecord['_id']
        finalResult.push(newRecord);
      })
    })
    return callback(null, finalResult);
  });
  
}
