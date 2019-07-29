'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;
const {Score} = require('../../models');

chai.should();

describe('/ScorePost', function() {
  after((done)=>{
    Score.remove({}, (err) => {
      done(err);
    });
  });
  describe('post', function() {
    it('should respond with 200 score was logged', function(done) {
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
          }
        }
      };

      let payload = {
        "UserId": 1,
        "LeaderboardId": 3,
        "Score": 56
      };
      api.post('/v1/ScorePost')
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
