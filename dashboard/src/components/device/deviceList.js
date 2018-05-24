import React, { Component } from 'react';
import Device from './device';

class DeviceList extends Component {
  constructor(props){
    super(props);
    this.apiUrl = '/api/_/device';
    this.devices;
    this.renderDevices.bind(this);
    this.pollInterval = 1000;
  }

  componentDidMount() {
    this.pollData();
  }

  componentWillUnmount() {
    this.cancel();
  }

  cancel() {
    clearInterval(this.pollDataFunction);
    this.pollDataFunction = null;
  }

  async getAllDevices() {
    let devices;
    try {
      devices = await fetch(this.apiUrl);
      devices = await devices.json();
    } catch(err) {
      this.onError(err);
      return;
    }
    this.setState({devices});
  }

  async pollData() {
    this.pollDataFunction = setInterval(this.getAllDevices.bind(this), this.pollInterval);
  } 

  onError(err) { 
    console.log("___ devie list error ", err);
  }

  renderDevices() {
    let devices = this.state.devices.map((device) => {
      return <Device 
        key = {device.id}
        device = {device}
        />
    });
    return devices;
  }

  render() {
    let devices;
    if (this.state && this.state.devices) {
      devices = this.renderDevices();
    }
    return(
      <div>
        <ul className='device-list'>{devices}</ul>
      </div>
    )
  }
}

export default DeviceList;