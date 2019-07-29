'use strict';
const {assert} = require('chai');
const sinon = require('sinon');
const LeaderboardService = require('../../services/LeaderboardService');
const {Score} = require('../../models');

describe('LeaderboardService test scenarios', function () {
  describe('getLeaderboard(): Retuns leader board score ranking along with the given users score and ranking', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers services/LeaderboardService.getLeaderboard
     */
    it('200 response code is returned when the getLeaderboard was successful', function (done) {
      let req = {
        swagger: {
          params: {
            getLeaderboard: {
              value: {
                "UserId": 1,
                "LeaderboardId": 1,
                "Offset": 0,
                "Limit": 25
              }
            }
          }
        }
      }
      let scoreFindOneResponse = {
        "UserId" : 5,
        "LeaderboardId" : 1,
        "Score" : 50,
        toJSON: ()=>{
          return {
            "UserId" : 5,
            "LeaderboardId" : 1,
            "Score" : 50
          }
        }
      };

      let stubScoreFindOne = sinon.stub(Score, 'findOne').callsFake((query, callback) => {
        callback(null, scoreFindOneResponse);
      });

      let arrResultsObject = {
        skip: function skip(skip) {
          assert.equal(
            skip,
            0,
            'Expected 0 item to be skipped'
          );
          return arrResultsObject;
        },
        limit: function limit(limit) {
          assert.equal(
            limit,
            25,
            'Expected the limit to match the limit passed'
          );
          return arrResultsObject;
        },
        sort: function sort() {
          return arrResultsObject;
        },
        exec: function exec(callback) {
          callback(null, [scoreFindOneResponse]);
        }
      };
      let stubScoreFind = sinon.stub(Score, 'find').callsFake((query) => {
        return arrResultsObject;
      });

      let expectedResponse = {"UserId":5,"LeaderboardId":1,"Score":50,"Rank":0,"Entries":[{"UserId":5,"LeaderboardId":1,"Score":50,"Rank":1}]};
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        stubScoreFind.restore();
        stubScoreFindOne.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const leaderboardService = new LeaderboardService();
      leaderboardService.getLeaderboard(req, res, nextSpy);
    });
  });
});