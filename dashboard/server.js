'use strict';
//const serve = require('serve');
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');

const proxyOptions = {
  target: 'http://localhost/',
  changeOrigin: true,         
  ws: true,
  router: {
    'localhost:8080' : 'http://api_server:8081'
  }
};
 
// Create proxy
const proxyServer = proxy(proxyOptions);
const app = express();

const buildPath = __dirname + '/build/index.html';

app.use('/api', proxyServer);
app.use('/', express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
  res.sendFile(buildPath);
});

app.listen(8080);