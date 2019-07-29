'use strict';
const chai = require('chai');
const ZSchema = require('z-schema');
const validator = new ZSchema({});
const supertest = require('supertest');
const api = supertest('http://localhost:5000'); // supertest init;
const config = require('config');
const secretKey = config.get('secret_key');
const crypto = require('crypto');
const {Transaction} = require('../../models');

chai.should();

describe('/Transaction', function() {
  after((done)=>{
    Transaction.remove({}, (err) => {
      done(err);
    });
  });
  describe('post', function() {
    it('should respond with 201 user transaction was logged', function(done) {
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
        "TransactionId": 100,
        "UserId": 1,
        "CurrencyAmount": 0
      };
      let hashValue = crypto.createHash('sha1')
        .update(secretKey + payload['TransactionId'] +  payload['UserId'], payload['CurrencyAmount'])
        .digest('hex');

      payload['Verifier'] = hashValue;
      
      api.post('/v1/Transaction')
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
