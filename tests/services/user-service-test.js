'use strict';
const {assert} = require('chai');
const sinon = require('sinon');
const UserService = require('../../services/UserService');

describe('UserService test scenarios', function () {
  describe('postuserContent(): Creates a user content', function () {

    /**
     * Test that a 200 response code is returned when the post was successful
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  25 May 2019
     *
     * @covers services/userContentService.postuserContent
     */
    it('200 response code is returned when the post was successful', function (done) {
      let req = {
        swagger: {
          params: {
            user_content: {
              value: {
                'category': 'sport',
                'source': 'string',
                'author': 'string',
                'title': 'string',
                'description': 'string',
                'url': 'string',
                'publishedAt': '2019-05-27T02:06:15.716Z',
                'content': 'string'
              }
            }
          }
        }
      }
      let expectedResponse = {
        'category': 'sport',
        'source': 'string',
        'author': 'string',
        'title': 'string',
        'description': 'string',
        'url': 'string',
        'publishedAt': '2019-05-27T02:06:15.716Z',
        'content': 'string'
      };
      let stubuserContent = sinon.stub(userContent.prototype, 'save').callsFake((callback) => {
        callback(null, expectedResponse);
      });
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 201, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        stubuserContent.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const userContentService = new userContentService();
      userContentService.postuserContent(req, res, nextSpy);
    });
  });
  describe('listuserContents(): List all the user records', function () {

    /**
     * Test that a 200 response code when all the user records are returned
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  25 May 2019
     *
     * @covers services/userContentService.listuserContents
     * @covers services/userContentService._getuserContentList
     */
    it('200 response code when all the user records are returned', function (done) {
      let req = {
        swagger: {
          params: {
            category: {
              value: 'sport'
            }
          }
        }
      }
      let expectedResponse = [
        {
          'category': 'sport',
          'source': 'string',
          'author': 'string',
          'title': 'string',
          'description': 'string',
          'url': 'string',
          'publishedAt': '2019-05-27T02:06:15.716Z',
          'content': 'string'
        }
      ];
      let expectedQuery = {
        'category': 'sport'
      };
      let arrResultsObject = {
        exec: function exec(callback) {
          callback(null, expectedResponse);
        }
      };
      let stubuserContent = sinon.stub(userContent, 'find').callsFake((query) => {
        assert.deepEqual(
          query,
          expectedQuery,
          'Incorrect query was passed'
        );
        return arrResultsObject;      
      });

      let logSpy = sinon.spy();
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(nextSpy.callCount, 0);
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        stubuserContent.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const userContentService = new userContentService();
      userContentService.listuserContents(req, res, nextSpy);
    });
  });
  describe('putuserContent(): replace a user record', function () {

    /**
     * Test that a 200 response code is returned when the user record is replaced
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  25 May 2019
     *
     * @covers services/userContentService.putuserContent
     */
    it('200 response code is returned when the user record is replaced', function (done) {
      let req = {
        swagger: {
          params: {
            user_content: {
              value: {
                'category': 'sport',
                'source': 'string',
                'author': 'string',
                'title': 'string',
                'description': 'string',
                'url': 'string',
                'publishedAt': '2019-05-27T02:06:15.716Z',
                'content': 'string'
              }
            },
            user_id: {
              value: 'someId'
            }
          }
        }
      }
      let expectedResponse = {
        'category': 'sport',
        'source': 'string',
        'author': 'string',
        'title': 'string',
        'description': 'string',
        'url': 'string',
        'publishedAt': '2019-05-27T02:06:15.716Z',
        'content': 'string'
      };

      let expectedResponseFind = {
        '_id': 'someId',
        'category': 'sport',
        'source': 'string',
        'author': 'string',
        'title': 'string',
        'description': 'string',
        'url': 'string',
        'publishedAt': '2019-05-27T02:06:15.716Z',
        'content': 'string'
      };

      let stubuserContentFind = sinon.stub(userContent, 'findOne').callsFake((query, callback) => {
        callback(null, expectedResponseFind);     
      });

      let stubuserContentSave = sinon.stub(userContent.prototype, 'save').callsFake((callback) => {
        callback(null, expectedResponse);
      });
  
      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponse), 'The response body does not match');
        stubuserContentSave.restore();
        stubuserContentFind.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const userContentService = new userContentService();
      userContentService.putuserContent(req, res, nextSpy);
    });
  });
  describe('deleteuserContent(): deletes a specific user record', function () {
    /**
     * Test that a 200 response code is returned when the record is removed
     *
     * @author Hadi Shayesteh <hadishayesteh@gmail.com>
     * @since  25 May 2019
     *
     * @covers services/userContentService.deleteuserContent
     */
    it('200 response code is returned when the record is removed', function (done) {
      let req = {
        swagger: {
          params: {
            user_id: {
              value: 'someId'
            }
          }
        }
      }

      let expectedResponseFind = {
        '_id': 'someId',
        'category': 'sport',
        'source': 'string',
        'author': 'string',
        'title': 'string',
        'description': 'string',
        'url': 'string',
        'publishedAt': '2019-05-27T02:06:15.716Z',
        'content': 'string'
      };

      let stubuserContentFind = sinon.stub(userContent, 'findOneAndRemove').callsFake((query, callback) => {
        callback(null, expectedResponseFind);     
      });


      let nextSpy = sinon.spy();
      let headerSpy = sinon.spy();

      let endSpy = sinon.spy(function (responseBody) {
        assert.equal(res.statusCode, 200, 'The response code does not match');
        assert.equal(responseBody, JSON.stringify(expectedResponseFind), 'The response body does not match');
        stubuserContentFind.restore();
        done();
      });

      let res = {
        statusCode: 0,
        setHeader: headerSpy,
        end: endSpy
      };
      const userContentService = new userContentService();
      userContentService.deleteuserContent(req, res, nextSpy);
    });
  });
});