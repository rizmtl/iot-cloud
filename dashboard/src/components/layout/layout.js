import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import DeviceList from '../device/deviceList';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddDevice: false
    }
  }

  componentWillUnmount() {
    console.log("--- component unmount");
  }

  onClick() {
    this.setState({
      toAddDevice: true
    });
  }
  
  render() {
    if (this.state.toAddDevice) {
      return <Redirect to='/add-device'/>
    }

    return (
      <div className='layout'>
        <DeviceList/>
        <div>
          <button class='btn hidden' onClick={this.onClick.bind(this)}>Add Device</button> 
        </div>
      </div>
    )
  }
}

export default Layout