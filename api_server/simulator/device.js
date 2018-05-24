'use strict';
const uuid = require('uuid/v1');
const http = require('http');
const Errors = require('http-errors');

class Device {
  constructor(options) {
    this.sensors = options.sensors ? options.sensors : [];
    this.pollInterval = 5000;

    this.logger = options.logger;
    this.url = options.url;
    this.port = options.port;
    this.name = options.name ? options.name : 'UNKNOWN';
    this.updateDeviceParams();
  }

  /**
   * Returns all sensors objects
   */
  getSensors() {
    return this.sensors;
  }

  /**
   * Sets sensor parameters
   * @param {Array} sensors - Array of sensor objectss
   */
  setSensors(sensors) {
    this.sensors = sensors;
  }

  setId(id) {
    this.device.id = id;
  }

  updateDeviceParams() {
    if (this.device) {
      this.device.sensors = this.getSensors();
      return this.device;
    }

    this.device = {
      name: this.name,
      sensors: this.getSensors()
    }
    return this.device;
  }

  /**
   * Return all device paramters
   */
  getDevice() {
    return this.device;
  }

  /**
   * Randomizes sensor data to simulate real world scenario
   */
  randomizeSensorData() {
    // Traverse through all sensor objects
    // randomly update values between 0 - 100
    let sensors = this.getSensors();
    let update = []; 

    sensors.map((sensor) => {
      sensor.randomizeValue();
      update.push(sensor);
    });

    this.setSensors(update);
  }

  /**
   * Sends request to API server
   * @param {Object} options - Parameters to update
   * {
   *    method: 'GET/PUT/POST/DELETE',
   *    payload: Payload to update
   * }
   */
  sendRequest(options) {
    const httpOptions = {
      port: this.port,
      hostname: this.hostname,
      path: options.url ? options.url : this.url,
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
              this.logger.error('Failed to parse response', err);
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

  /**
   * Create device on the server. Returns promise
   */
  async create() {
    let data;
    let options = {
      method: 'POST',
      payload: JSON.stringify(this.getDevice()),
      successCode: 201
    }
  
    try {
      data = await this.sendRequest(options);
    } catch (err) {
      this.logger.error('Failed to link device to server', err);
      throw new Errors.InternalServerError(err);
    }
    return data;
  }

  /**
   * Update device information on the server. Returns promise
   */
  async update(params) {
    let data;
    let options = {
      method: 'PUT',
      payload: params && params.device ? params.device : JSON.stringify(this.getDevice()),
      url: `${this.url}/${this.device.id}`,
      successCode: 200
    }

    try {
      data = await this.sendRequest(options);
    } catch (err) {
      this.logger.error('Failed to update device parameters', err);
      throw new Errors.InternalServerError(err);
    }
    return data;
  }

  /**
   * Delete device from the server. Returns promise
   */
  async delete() {
    let data;
    let options = {
      method: 'DELETE',
      url: `${this.url}/${this.device.id}`,
      successCode: 200
    }

    try {
      data = await this.sendRequest(options);
    } catch (err) {
      this.logger.error('Failed to remove device', err);
      throw new Errors.InternalServerError(err);
    }
  }

  /**
   * Simulates sensor data with random values
   */
  async simulateWorkingDevice() {
    try {
      this.randomizeSensorData();
      this.updateDeviceParams();
      this.device = await this.update();
    } catch(err) {
      this.logger.error('Failed to simulate device', err);
      this.stop();
    }
    this.logger.info('Device updated id:', this.device.id);
  }

  /**
   * Starts device, it will update device informaiton periodically on the server
   * to simulate real world scenario
   */
  async start(skipCreate) {
    this.logger.info('Starting device');
    if (!this.updateFunctionInterval && !skipCreate) {
      try {
        this.device = await this.create();
      } catch (err) {
        this.logger.error('Failed to link device to server', err);
        throw new Errors.InternalServerError('Failed to link to server');
        this.stop();
      }
      this.logger.info('Successfully linked to server id:', this.device.id);
    }

    this.updateFunctionInterval = setInterval(this.simulateWorkingDevice.bind(this), this.pollInterval);
  }

  /**
   * Stops device. It will stop updating device information on the server
   */
  stop() {
    this.logger.info('Stopping device');
    if (this.updateFunctionInterval) {
      clearInterval(this.updateFunctionInterval);
      this.updateFunctionInterval = null;
    }
  }
}

module.exports = Device;
