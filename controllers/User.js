'use strict';

const UserService = require('../services/UserService');

/**
 * saves user record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.saveUser = function saveUser(req, res, next) {
  let userService = new UserService();
  userService.saveUser(req, res, next);
};

/**
 * loads user record
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
module.exports.loadUser = function loadUser(req, res, next) {
  let userService = new UserService();
  userService.loadUser(req, res, next);
};