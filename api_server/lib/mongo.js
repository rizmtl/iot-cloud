'use strict'
const MongoClient = require('mongodb').MongoClient;
const Errors = require('http-errors');

class Client {
  constructor(options) {
    this.url = 'mongodb://mongo:27017/sensors';
    this.dbName = 'sensors'
    this.logger = options.logger;
  }

  async connect(url, options) {
    if (!url) {
      url = this.url;
    }

    if (!options) {
      options = {};
    }

    let client;
    try {
      client = await MongoClient.connect(url, options);
    } catch (err) {
      this.logger.error('Failed to connect to mongodb', {err});
      throw new Errors.InternalServerError('Failed to connect to mongo');
    }

    const dB = client.db(this.dbName);
    this.dB = dB;

    dB.on('connect', () => this.logger.info('Connected to mongodb'));
    dB.on('reconenct', () => this.logger.info('Reconnected to mongo'));
    dB.on('disconnect', () => this.logger.info('Disconnected from mongodb'));

    return {
      client,
      dB
    }
  }

  async initDb() {
    try {
      this.dB.createCollection('devices')
    } catch (err) {
      this.logger.error('Failed to create collection', {err});
      throw new Error.InternalServerError('Failed to create collection');
    }
    this.logger.info('Initialized db');
  }
}

module.exports = Client;