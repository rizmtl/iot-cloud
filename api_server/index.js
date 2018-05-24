'use strict'
const express = require('express');
const bunyan = require('bunyan');
const cors = require
const DeviceApi = require('./api/device');
const DeviceManager = require('./managers/deviceManager');
const Mongo = require('./lib/mongo');

const listeningPort = 8081;
const name = 'api_server';

const logger = bunyan.createLogger({
  'name': name ,
  serializers: bunyan.stdSerializers
});

const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};

const app = express();
app.use(express.json());
app.use(allowCrossDomain);

const mongo = new Mongo({logger});
mongo.connect()
  .then(({client, dB}) => {
    const deviceManager = new DeviceManager({dB, logger});
    const deviceApi = new DeviceApi({app, deviceManager});
    app.listen(listeningPort, () => {
      logger.info('Api server listening on port', listeningPort);
    });
  });




