import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Link,
  Switch  
} from 'react-router-dom'

import Layout from './components/layout/layout';
import AddDevice from './components/device/addDevice';
import './assets/style.css';

class App extends Component {
  render() {
    return (
      <div>
        <header>
          <div className='container'>
            <h1 id='acme-header'>ACME IoT Dashboard</h1>
          </div>
        </header>
        <div className='container'>
          <BrowserRouter>
            <Switch>
              <Route path='/' exact component={Layout}/>
              <Route path='/add-device' exact component={AddDevice}/>
            </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
