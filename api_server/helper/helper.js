'use strict';
const http = require('http');
const Errors = require('http-errors');

/**
 * Returns a random value between 0 - max value provided.
 * Defaults between 0 - 100;
 * 
 * @param {Number} max - Maximum value of integer returned
 */
exports.getRandomInt = (max) => {
  if (!max) {
    max = 100;
  }
  return Math.floor(Math.random() * Math.floor(max));
}


/**
 * Sends request to API server
 * @param {Object} options - Parameters to update
 * {
 *    method: 'GET/PUT/POST/DELETE',
 *    payload: Payload to update
 * }
 */
exports.sendRequest = (options) => {
    const httpOptions = {
      port: options.port,
      hostname: options.hostname,
      path: options.url,
      method: options.method ? options.method : 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': options.payload ? Buffer.byteLength(options.payload) : 0
      }
    };
    
    return new Promise((resolve, reject) => {
      let body='';
      const req = http.request(httpOptions, (res) => {
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
  
        res.on('end', () => {
          if (body) {
            try {
              body = JSON.parse(body);
            } catch(err) {
              console.log('body', body);
              options.logger.error('Failed to parse response', err);
              return reject(new Errors.InternalServerError('Failed to parse data'));
            }
          }

          if (res.statusCode != options.successCode) {
            return reject(body);
          }

          return resolve(body);
        });

        res.on('error', (err) => {
          return reject(err);
        });
      });
  
      req.on('error', (err) => {
        return reject(err);
      });
      
      if (options.payload) {
        req.write(options.payload);
      }
      req.end();
    });
  }