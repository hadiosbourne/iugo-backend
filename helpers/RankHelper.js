'use strict';

const {Score} = require('../models');

/**
 * Helper for returning the rank
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @module RankHelper
 */
module.exports = {

  /**
   * This will calculate the ranks and returns the result
   *
   * @param {Number} board - The count of getList results
   * @param {Number} userId - The base url that does not yet have the api version set onto it.
   * @param {Function} callback - All params possible from swagger
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  getRank: function getRank(board, userId, callback) {
    var rank = 0;
    var userTwoRank = 0;
    Score.find({'LeaderboardId': board})
      .sort({'Score': -1 })
      .exec((err, results) => {
        if (err) {
          let runtimeError = {
            code: 500,
            message: {
              'Error': true,
              'ErrorMessage': 'An error occurred while calculating ranks ' + err
            }
          };
          return callback(runtimeError);
        }
        results.forEach(record => {
          rank++;
          if (record['UserId'] == userId) {
            userTwoRank = rank;
          }
        });
        return callback(null, userTwoRank);
      });
  }
};
