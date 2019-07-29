'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;
const {Score} = require('../../models');

chai.should();

describe('/LeaderboardGet', function() {
  describe('post', function() {
    let scoreRecords = [
      {
        "UserId": 1,
        "LeaderboardId": 1,
        "Score": 10
      },
      {
        "UserId": 1,
        "LeaderboardId": 3,
        "Score": 56
      }
    ];

    before((done) => {
      Score.insertMany(scoreRecords, (saveError) => {
        done(saveError);
      });
    });

    after((done)=>{
      Score.remove({}, (err) => {
        done(err);
      });
    });

    it('should respond with 200 leader board score ranking', function(done) {
      const schema = {
        "type": "object",
        "properties": {
          "UserId": {
            "type": "integer",
            "default": 1,
            "minimum": 1
          },
          "LeaderboardId": {
            "type": "integer",
            "default": 1,
            "minimum": 1
          },
          "Score": {
            "type": "integer"
          },
          "Rank": {
            "type": "integer",
            "default": 1,
            "minimum": 1
          },
          "Entries": {
            "type": "array",
            "items": {
              "description": "user score post",
              "type": "object",
              "properties": {
                "UserId": {
                  "type": "integer",
                  "default": 1,
                  "minimum": 1
                },
                "Score": {
                  "type": "integer"
                },
                "Rank": {
                  "type": "integer",
                  "default": 1,
                  "minimum": 1
                }
              }
            }
          }
        }
      };
      
      let payload = {
        "UserId": 1,
        "LeaderboardId": 1,
        "Offset": 0,
        "Limit": 1
      };
      api.post('/v1/LeaderboardGet')
      .set('Accept', 'application/json')
      .send(payload)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});
