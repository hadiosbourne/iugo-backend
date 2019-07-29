'use strict';
const {assert} = require('chai');
const sinon = require('sinon');
const ScoreService = require('../../services/ScoreService');
const {Score} = require('../../models');

describe('LeaderboardService test scenarios', function () {
  describe('postScore(): Retuns leader board score ranking along with the given users score and ranking', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers services/ScoreService.postScore
     */
    it('200 response code is returned when the postScore was successful', function (done) {
      let req = {
        swagger: {
          params: {
            ScorePost: {
              value: {
                "UserId": 1,
                "LeaderboardId": 1,
                "Score": 50
              }
            }
          }
        }
      }
      let scoreFindOneResponse = {
        "UserId" : 1,
        "LeaderboardId" : 1,
        "Score" : 50,
        toJSON: ()=>{
          return {
            "UserId" : 1,
            "LeaderboardId" : 1,
            "Score" : 50
          }
        }
      };

      let scoreSaveResponse = {
        "UserId" : 1,
        "LeaderboardId" : 1,
        "Score" : 50
      };

      let stubScoreFindOne = sinon.stub(Score, 'findOne').callsFake((query, callback) => {
        callback(null, scoreFindOneResponse);
      });
      let stubScoreSave = sinon.stub(Score.prototype, 'save').callsFake((query, callback) => {
        callback(null, scoreSaveResponse);
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
      let expectedResponse = {
        "UserId": 1,
        "LeaderboardId": 1,
        "Score": 50,
        "Rank": 1
      };
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        stubScoreSave.restore();
        stubScoreFindOne.restore();
        stubScoreFind.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const scoreService = new ScoreService();
      scoreService.postScore(req, res, nextSpy);
    });
  });
});