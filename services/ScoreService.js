'use strict';
const {Score} = require('../models');
const _ = require('lodash');
const {getRank} = require('../helpers/RankHelper');

/**
 * Create an instance of the User Transaction service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
class UserTransactionService {

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
  postScore(req, res, next) {
    let payload = req.swagger.params.ScorePost.value;
    _findOneScoreRecord({'LeaderboardId': payload['LeaderboardId'], 'UserId': payload['UserId']}, (findError, findRecord)=>{
      if(findError) {
        res.status(500).json(findError);
        return next();
      }
      _buildRankRecord(payload, findRecord, (buildRankError, rankRecord)=>{
        if(buildRankError) {
          res.status(500).json(buildRankError);
          return next();
        }
        getRank(payload['LeaderboardId'],  payload['UserId'], (rankError, rank)=>{
          if(rankError) {
            res.status(500).json(rankError);
            return next();
          }
          rankRecord['Rank'] = rank;
          let ignoreFields = ['__v', '_id'];
          ignoreFields.forEach((key) => {
            delete rankRecord[key];
          });  
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(rankRecord));
        })
      })
    });
  }
}

module.exports = UserTransactionService;

/**
 * Get the UserTransaction record from database
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
function _buildRankRecord(payload, findOne, callback) {
  if (_.isEmpty(findOne)) {
    let newScore = new Score(payload);
    _saveScore(newScore, (err, res)=>{
      if(err) {
        return callback(err);
      }
      return callback(null, res.toJSON());
    })
  } else if (payload['Score'] > findOne['Score']) {
    findOne['Score'] = payload['Score']
    _saveScore(findOne, (err, res)=>{
      if(err) {
        return callback(err);
      }
      return callback(null, res.toJSON());
    })
  } else {
    return callback(null, findOne.toJSON());
  }

}

/**
 * Get the UserTransaction record from database
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
function _saveScore(score, callback) {
  score.save((err, res)=>{
    if(err) {
      let runtimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while saving Score' + err
      };
      return callback(runtimeError);
    }
    return callback(null, res);
  })
}

/**
 * Get the UserTransaction record from database
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
function _findOneScoreRecord(query, callback) {
  Score.findOne(query, (err, res)=>{
    if(err) {
      let runtimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving Score' + err
      };
      return callback(runtimeError);
    }
    return callback(null, res);
  })
}