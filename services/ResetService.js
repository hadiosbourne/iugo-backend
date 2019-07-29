'use strict';
const {User, Score, Transaction} = require('../models');

/**
 * Create an instance of the Reset service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2019
 */
class ResetService {

  constructor() {}

  /**
   * Resets the given database
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
  resetDB(req, res, next) {
    let dbMap = {
      'User': User,
      'Score': Score,
      'Transaction': Transaction
    }
    let database = req.swagger.params.Database.value;
    dbMap[database].remove({}, (err) => {
      if(err) {
        let runtimeError = {
          'Error': true,
          'ErrorMessage': 'There was an error while reseting database: ' + database + ' ' + err
        };
        res.status(500).json(runtimeError);
        return next();
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({'Success': true}));   
    });
  }
}

module.exports = ResetService;