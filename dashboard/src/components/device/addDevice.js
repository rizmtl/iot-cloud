import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import CreateSensor from '../sensor/createSensor';

class AddDevice extends Component {
  constructor(props) {
    super(props);
    this.numOfSensors = 3;
    this.state = {
      toDashboard: false
    }
  }

  addSensor() {

  }
  
  deleteSensor() {

  }
  
  saveDevice() {

  }

  cancel() {
    this.setState({
      toDashboard: true
    });
  }

  render() {
    if (this.state.toDashboard) {
      return <Redirect to='/'/>
    }

    return(
      <div>
        <ul>
          <CreateSensor/>
        </ul>
        <button onClick={this.saveDevice.bind(this)}>Save</button>
        <button onClick={this.cancel.bind(this)}>Cancel</button>
      </div>
    )
  }
}

export default AddDevice;