import React, { Component } from 'react';

class Sensor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li> 
        <div className="sensor-data">
          <span className='sensor-name'>{this.props.sensor.name}</span> : <span>{this.props.sensor.value}</span> <span>{this.props.sensor.unit}</span>
        </div>
      </li>
  )};
}

export default Sensor;