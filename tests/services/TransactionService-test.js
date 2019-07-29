'use strict';
const {assert} = require('chai');
const sinon = require('sinon');
const TransactionService = require('../../services/TransactionService');
const {Transaction} = require('../../models');
const config = require('config');
const secretKey = config.get('secret_key');
const crypto = require('crypto');

describe('LeaderboardService test scenarios', function () {
  describe('postUserTransaction(): Logs User Transaction', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers services/TransactionService.postUserTransaction
     */
    it('200 response code is returned when the postUserTransaction was successful', function (done) {
      let payload = {
        "TransactionId": 1,
        "UserId": 1,
        "CurrencyAmount": 0
      };
      payload['Verifier'] = crypto.createHash('sha1')
      .update(secretKey + payload['TransactionId'] +  payload['UserId'], payload['CurrencyAmount'])
      .digest('hex');
      let req = {
        swagger: {
          params: {
            Transaction: {
              value: payload
            }
          }
        }
      }

      let stubTransactionFindOne = sinon.stub(Transaction, 'findOne').callsFake((query, callback) => {
        callback(null, {});
      });
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 201, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify({"Success": true}), 'The response body does not match');
        stubTransactionFindOne.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const transactionService = new TransactionService();
      transactionService.postUserTransaction(req, res, nextSpy);
    });
  });

  describe('postUserTransactionStats(): Logs User Transaction', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers services/TransactionService.postUserTransactionStats
     */
    it('200 response code is returned when the postUserTransactionStats was successful', function (done) {

      let req = {
        swagger: {
          params: {
            TransactionStats: {
              value: {"UserId": 1}
            }
          }
        }
      }
      let transactionFindResult = [
        {
          "TransactionId" : 1,
          "UserId" : 1,
          "CurrencyAmount" : 10,
          "Verifier" : "dd89f1c522a2b141a66e86f45eecb4a283c849b1"
        },
        {
          "TransactionId" : 2,
          "UserId" : 1,
          "CurrencyAmount" : 100,
          "Verifier" : "dd89f1c522a2b141a66e86f45eecb4a283c849b1"
        }
      ];
      let arrResultsObject = {
        exec: function exec(callback) {
          callback(null, transactionFindResult);
        }
      };
      let stubTransactionFind = sinon.stub(Transaction, 'find').callsFake((query) => {
        return arrResultsObject;
      });

      let stubTransactionCount = sinon.stub(Transaction, 'count').callsFake((query, callback) => {
        callback(null, 2);
      });
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let expectedResult = {
        'UserId': 1,
        'TransactionCount': 2,
        'CurrencySum': 110
      };
      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResult), 'The response body does not match');
        stubTransactionFind.restore();
        stubTransactionCount.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const transactionService = new TransactionService();
      transactionService.postUserTransactionStats(req, res, nextSpy);
    });
  });
});