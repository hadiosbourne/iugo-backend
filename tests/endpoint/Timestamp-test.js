'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;

chai.should();

describe('/Timestamp', function() {
  describe('get', function() {
    it('should respond with 200 The current unix timestamp...', function(done) {
      const schema = {
        "type": "object",
        "required": [
          "Timestamp"
        ],
        "properties": {
          "Timestamp": {
            "type": "integer"
          }
        }
      };

      api.get('/v1/Timestamp')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});
