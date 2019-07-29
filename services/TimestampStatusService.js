'use strict';

/**
 * Create an instance of the timestamp status service
 *
 * @author Hadi Shayesteh <hadishayesteh@gmail.com>
 * @since  27 July 2018
 */
 class TimestampStatusService {

  constructor() {}

  /**
   * Gets the current timestamp
   *
   * @param {object} req - The request arguments passed in from the controller
   * @param {IncomingMessage} res - The http response object
   * @param {function} next - The callback used to pass control to the next action/middleware
   *
   * @author Hadi Shayesteh <hadishayesteh@gmail.com>
   * @since  27 July 2018
   *
   * @return void
   */
 async getTimestamp(req, res, next) {
    try {
      const time = await new Date().getTime();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        'Timestamp': time
      });
    } catch (err) {
      let error = {
        'Error': true,
        'ErrorMessage': 'An error occurred while retrieving timestamp' + err
      };
      next(error) 
    }
  }

}

module.exports = TimestampStatusService;
