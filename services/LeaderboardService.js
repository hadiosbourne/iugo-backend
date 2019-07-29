'use strict';
const {Score} = require('../models');
const _ = require('lodash');
const {getRank} = require('../helpers/RankHelper');

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
    _findOneScore({'LeaderboardId': leaderBoardId, 'UserId': UserId}, (scoreError, scoreRecord)=>{
      if(scoreError) {
        res.status(500).json(scoreError);
        return next();
      }
      if(_.isEmpty(scoreRecord)) {
        let resourceNotFound = {
          'Error': true,
          'ErrorMessage': 'the given UserId ' + UserId + 'does not have value for LeaderBoard ' + leaderBoardId
        };
        res.status(404).json(resourceNotFound);
        return next();
      }
      _findScoreRecords({'LeaderboardId': leaderBoardId}, payload['Offset'], payload['Limit'], (findError, findRecord)=>{
        if(findError) {
          res.status(500).json(findError);
          return next();
        }
        getRank(leaderBoardId, UserId, (rankError, rank)=>{
          if(rankError) {
            res.status(500).json(rankError);
            return next();
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(_buildupResponse(scoreRecord.toJSON(), rank, findRecord)));
        })
      });
    })

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
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving Score ' + err
      };
      return callback(runtimeError);
    }
    return callback(null, res);
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
  Score.find(query)
    .skip(offset)
    .limit(limit)
    .sort({'Score': -1})
    .exec((err, results) => {
      if (err) {
        let runtimeError = {
          'Error': true,
          'ErrorMessage': 'An error occurred while retrieving Score records ' + err
        };
        return callback(runtimeError);
      }
      let finalResult = [];
      results.filter((entry)=>{
        getRank(query['LeaderboardId'], entry['UserId'], (err, rank)=>{
          if(err) {
            return callback(err);
          }
          let newRecord = entry.toJSON();
          newRecord['Rank'] = rank;
          delete newRecord['_id']
          finalResult.push(newRecord);
        })
      })
      return callback(null, finalResult);
    });
}