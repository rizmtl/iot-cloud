import React, { Component } from 'react';

class Sensor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr className='sens-items'>
        <td>{this.props.sensor.name}</td>
        <td>: {this.props.sensor.value}</td>
        <td>{this.props.sensor.unit}</td>
      </tr>
  )};
}

export default Sensor;