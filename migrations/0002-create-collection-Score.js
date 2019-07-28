'use strict';
const Bluebird = require('bluebird')

const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const config = require('config');

const url = config.mongo['database_host'];

Bluebird.promisifyAll(MongoClient)

module.exports.up = next => {
  return MongoClient.connect(url)
  .then(db => {
    db.createCollection('Score', {collation: {locale: 'en_US', strength: 2}});
    MongoClient.close()
  })
  .catch(err => next(err))
}