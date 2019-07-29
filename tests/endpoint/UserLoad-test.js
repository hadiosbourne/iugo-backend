'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;
const {User} = require('../../models');

chai.should();

let userRecord = {
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

describe('/UserLoad', function() {
  before((done) => {
    User.insertMany(userRecord, (saveError) => {
      done(saveError);
    });
  });
  after((done)=>{
    User.remove({}, (err) => {
      done(err);
    });
  });
  describe('post', function() {
    it('should respond with 200 user load result', function(done) {
      const schema = {
        "type": "object"
      };

      api.post('/v1/UserLoad')
      .set('Accept', 'application/json')
      .send({
        "UserId": 1
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        validator.validate(res.body, schema).should.be.true;
        done();
      });
    });

  });

});
