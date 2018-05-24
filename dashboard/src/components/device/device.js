import React, { Component } from 'react';
import Sensor from '../sensor/sensor';

class Device extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.device;
    this.device = this.props.device
    this.pollInterval = 1000;
    this.url = `/api/_/device/${this.props.device.id}`;
    this.renderSensorData.bind(this);
  }

  renderSensorData() {
    return this.props.device.sensors.map((sensor) => {
        return <Sensor 
          key = {sensor.name} 
          sensor = {sensor}
        />
    });
  }

  render() {
    let renderedSensorData = this.renderSensorData();
    return(
      <li>
        <div className='device'>
          <div className='device-name'>Name: {this.props.device.name}</div>
          <ul className='sensor-list'>{renderedSensorData}</ul>
        </div>
      </li>
    )
  }
}

export default Device;