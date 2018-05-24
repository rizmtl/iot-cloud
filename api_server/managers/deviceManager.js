'use strict';
const assert = require('assert');
const uuid = require('uuid/v1');
const Errors = require('http-errors');

class DeviceManager {
  constructor(options) {
    this.dB = options.dB;
    this.logger = options.logger;
    this.collection = this.dB.collection('devices');
  }

  async createDevice(payload) {
    let status, device;

    // Check if duplicate
    if (payload.id) {
      try {
        device = this.getDevice({ id: payload.id });
      } catch (err) {
        throw err;
      }
    }
    
    // Duplicate device found
    if (device) {
      throw new Errors.Conflict();
    }

    let cleaned = this.cleanPayload(payload);
    if (!cleaned) {
      this.logger.error('Failed to clean device payload');
      throw new Errors.BadRequest('Invalid device payload');
    }

    if (!cleaned.id) {
      cleaned.id = uuid();
    }

    try {
      status = await this.collection.insertOne(cleaned);
      device = await this.collection.findOne({id: cleaned.id});
      assert.strictEqual(1, status.insertedCount);
    } catch (err) {
      this.logger.error('Failed to create new device', {err});
      throw new Errors.InternalServerError('Failed to create device');
    }
    
    return device;
  }
  
  async getDevice(query) {
    let docs;
    if (!query) {
      query = {};
    }

    try {
      docs = await this.collection.findOne(query, {});
    } catch (err) {
      this.logger.error('Failed to get device', {err});
      throw new Errors.InternalServerError('Failed to get device');
    }
    return docs;
  }

  async getAllDevices() {
    let docs;
    let options = {
      batchSize: 500,
    }

    try {
      docs = await this.collection.find({}, options).toArray();
    } catch (err) {
      this.logger.error('Failed to get devices', {err});
      throw new Errors.InternalServerError('Failed to get device');
    }
    return docs;
  }

  async updateDevice(filter, update) {
    let docs;
    let clean = this.cleanPayload(update)
    
    try {
      docs = await this.collection.findOneAndUpdate(filter, { $set: clean }, { returnOriginal: false });
      assert.strictEqual(1, docs.ok);
    } catch (err) {
      this.logger.error('Failed to update device', {err});
      throw new Errors.InternalServerError('Failed to update device parameters');
    }

    if (!docs.value) {
      this.logger.error('No device was updated');
      throw new Errors.InternalServerError('No device updated');
    }
    return docs.value;
  }

  async deleteDevice(filter) {
    let docs;
    try {
      docs = await this.collection.findOneAndDelete(filter);
      assert.strictEqual(1, docs.ok);
    } catch (err) {
      this.logger.error('Failed to delete device', {err});
      throw new Errors.InternalServerError('Failed to set delete device');
    }

    if (!docs.value) {
      this.logger.error('Device not found');
      throw new Errors.NotFound('Device not found');
    }
    
    return docs.value;
  }

  async deleteAllDevices() {
    let docs;
    try {
      docs = await this.collection.remove({});
      assert.strictEqual(1, docs.result.ok);
    } catch (err) {
      this.logger.error('Failed to delete all devices', err);
      throw new Errors.InternalServerError('Failed to delete all devices');
    }

    if (!docs.result.n) {
      this.logger.error('Devices not found');
      throw new Errors.NotFound('Devices not found');
    }
    
    return docs.value;
  }

  cleanPayload(payload) {
    if (!payload) {
      return;
    }
    
    delete payload.id;
    delete payload._id;
    return payload;
  }
}

module.exports = DeviceManager;