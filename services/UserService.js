'use strict';
const {User} = require('../models');
const _ = require('lodash');

/**
 * Create an instance of the User service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
class UserService {

  constructor() {}

  /**
   * saves user record
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  saveUser(req, res, next) {
    let payload = req.swagger.params.saveUser.value;
    _upsertUserRecord(payload, payload['UserId'],(err, result)=>{
      if(err) {
        res.status(500).json(err);
        return next();
      }
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({'Success': true}));
    })
  }

  /**
   * retuns user data record
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2019
   *
   * @return void
   */
  loadUser(req, res, next) {
    let payload = req.swagger.params.loadUser.value;
    _findUserRecord({'UserId': payload['UserId']}, (findError, findRecord)=>{
      if(findError) {
        res.status(500).json(findError);
        return next();
      }
      let response;
      if(_.isEmpty(findRecord)) {
        response = {};
      } else {
        response = findRecord['Data'];
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    });
  }
}

module.exports = UserService;

/**
 * Get the UserTransaction record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _upsertUserRecord(payload, userId, callback) {
  _findUserRecord({'UserId': userId}, (findError, findRecord)=>{
    if(findError) {
      return next(findError);
    }
    let saveRecord;
    if(_.isEmpty(findRecord)) {
      saveRecord = new User(payload);
    } else {
      saveRecord = _buildupUpsertObject(findRecord, payload)
    }
    return _saveUser(saveRecord, callback);
  });
}

/**
 * Updates the record from database if there is a property changed in the passed in payload
 *
 * @param {object} existingRecord - The existing record from database
 * @param {object} newRecord - The new record from payload
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _buildupUpsertObject(existingRecord, newRecord) {
  for (var i=1; i<arguments.length; i++) {
    for (var prop in arguments[i]) {
      var val = arguments[i][prop];
      if (typeof val == "object")
      _buildupUpsertObject(existingRecord[prop], val);
      else
      existingRecord[prop] = newRecord[prop];
    }
  }
  return existingRecord;
}

/**
 * Get the UserTransaction record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _findUserRecord(query, callback) {
  User.findOne(query, (err, res)=>{
    if(err) {
      let runTimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving UserScore' + err
      };
      return callback(runTimeError);
    }
    return callback(null, res);
  })
}

/**
 * Get the UserTransaction record from database
 *
 * @param {object} query - The query to match
 * @param {function} callback - The callback
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 *
 * @private
 *
 * @return void
 */
function _saveUser(userRecord, callback) {
  userRecord.save((err, res)=>{
    if(err) {
      let runTimeError = {
        'Error': true,
        'ErrorMessage': 'An error occurred while saving User' + err
      };
      return callback(runTimeError);
    }
    return callback(null, res);
  })
}
