'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;
const {Transaction} = require('../../models');
const crypto = require('crypto');
const config = require('config');
const secretKey = config.get('secret_key');

chai.should();

describe('/TransactionStats', function() {
  let transRecord = {
    "TransactionId": 1,
    "UserId": 1,
    "CurrencyAmount": 0
  };
  let hashValue = crypto.createHash('sha1')
    .update(secretKey + transRecord['TransactionId'] +  transRecord['UserId'], transRecord['CurrencyAmount'])
    .digest('hex');

  transRecord['Verifier'] = hashValue;

  before((done) => {
    Transaction.insertMany(transRecord, (saveError) => {
      done(saveError);
    });
  });
  after((done)=>{
    Transaction.remove({}, (err) => {
      done(err);
    });
  });
  describe('post', function() {
    it('should respond with 200 user transaction was...', function(done) {
      const schema = {
        "type": "object",
        "properties": {
          "UserId": {
            "type": "integer",
            "default": 1,
            "minimum": 1
          },
          "CurrencySum": {
            "type": "integer"
          },
          "TransactionCount": {
            "type": "integer",
            "default": 1,
            "minimum": 1
          }
        }
      };

      let payload = {
        "UserId": 1
      };
      api.post('/v1/TransactionStats')
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
