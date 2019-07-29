'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;

chai.should();

describe('/UserSave', function() {
  describe('post', function() {
    it('should respond with 200 user save result', function(done) {
      const schema = {
        "type": "object",
        "properties": {
          "Success": {
            "type": "boolean",
            "default": true
          }
        }
      };

      let payload = {
        "UserId": 1,
        "Data": {
          "Piece1": {
            "SubData": 1234,
            "SubData2": "abcd"
          },
          "Piece2": {
            "SubData": {
              "SubSubData": 5678
            }
          }
        }
      };
      api.post('/v1/UserSave')
      .set('Accept', 'application/json')
      .send(payload)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});
