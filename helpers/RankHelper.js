'use strict';

const {Score} = require('../models');

/**
 * Helper for doing getList requests
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @module RankHelper
 */
module.exports = {

  /**
   * This will return the getlist rel link
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
          let runTimeError = 'An error occurred while retrieving all countries' + err;
          return callback(runTimeError);
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