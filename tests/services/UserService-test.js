'use strict';
const {assert} = require('chai');
const sinon = require('sinon');
const UserService = require('../../services/UserService');
const {User} = require('../../models');
const config = require('config');
const secretKey = config.get('secret_key');
const crypto = require('crypto');

describe('UserService test scenarios', function () {
  describe('saveUser(): saves user record', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers services/UserService.saveUser
     */
    it('200 response code is returned when the saveUser was successful', function (done) {

      let req = {
        swagger: {
          params: {
            saveUser: {
              value: {
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
              }
            }
          }
        }
      }

      let stubUserFindOne = sinon.stub(User, 'findOne').callsFake((query, callback) => {
        callback(null, {});
      });

      let stubUserSave = sinon.stub(User.prototype, 'save').callsFake((callback) => {
        callback(null, {});
      });
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 201, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify({"Success": true}), 'The response body does not match');
        stubUserFindOne.restore();
        stubUserSave.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const userService = new UserService();
      userService.saveUser(req, res, nextSpy);
    });
  });

  describe('postUserTransactionStats(): Logs User Transaction', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  28 July 2019
     *
     * @covers services/UserService.loadUser
     */
    it('200 response code is returned when the loadUser was successful', function (done) {

      let req = {
        swagger: {
          params: {
            loadUser: {
              value: {
                "UserId": 1
              }
            }
          }
        }
      }
      let findOneResponse = {
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
      let stubUserFindOne = sinon.stub(User, 'findOne').callsFake((query, callback) => {
        callback(null, findOneResponse);
      });
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(findOneResponse['Data']), 'The response body does not match');
        stubUserFindOne.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const userService = new UserService();
      userService.loadUser(req, res, nextSpy);
    });
  });
});