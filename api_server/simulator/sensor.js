'use strict';
const Helper = require('../helper/helper');

class Sensor {
  constructor(options) {
    this.setParams(options);
  }

  /**
   * Returns all sensor parameters
   */
  getParams() {
    return {
      value: this.value, 
      name: this.name,
      unit: this.unit
    }
  }

  /**
   * Sets all sensor parameters
   * @param {Object} params - Sensor parameters
   * {
   *  name: sensor name,
   *  value: sensor value,
   *  unit: sensor unit
   * }
   */
  setParams(params) {
    this.value = params.value ? params.value : 'UNKNOWN';
    this.name = params.name ? params.name : 'UNKNOWN';
    this.unit = params.unit ? params.unit : 'UNKNOWN';
  }

  /**
   * Sets sensor value
   * @param {Number} value - Sensor value 
   */
  setValue(value) {
    this.value = value;
  }

  /**
   * Randomize sensor value
   * @param {Number} max - Maximum sensor value, defaults to 100
   */
  randomizeValue(max) {
    this.setValue(Helper.getRandomInt(max));
  }
}

module.exports = Sensor;


