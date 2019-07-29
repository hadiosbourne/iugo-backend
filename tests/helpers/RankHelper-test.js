'use strict';
const {assert} = require('chai');
const sinon = require('sinon');
const RankHelper = require('../../helpers/RankHelper');
const {Score} = require('../../models');

describe('RankHelper test scenarios', function () {
  describe('getRank(): Retuns the rank', function () {

    /**
     * Test successful return of the rank
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers helpers/RankHelper.getRank
     */
    it('successful return of the rank', function (done) {
      let boardId = 2;
      let userId = 1;

      let scoreFindResponse = [
        {
          "UserId" : 5,
          "LeaderboardId" : 2,
          "Score" : 50
        },
        {
          "UserId" : 4,
          "LeaderboardId" : 2,
          "Score" : 25
        },
        {
          "UserId" : 1,
          "LeaderboardId" : 2,
          "Score" : 13
        }
      ];

      let arrResultsObject = {
        sort: function sort() {
          return arrResultsObject;
        },
        exec: function exec(callback) {
          callback(null, scoreFindResponse);
        }
      };
      let stubScoreFind = sinon.stub(Score, 'find').callsFake((query) => {
        return arrResultsObject;
      });
  
      let callbackpy = sinon.spy(function (err, rank) {
        assert.equal(rank, 3, 'The rank does not match');
        stubScoreFind.restore();
        done();
      });

      RankHelper.getRank(boardId, userId, callbackpy);
    });
  });
});