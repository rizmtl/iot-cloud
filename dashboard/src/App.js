import React, { Component } from 'react';
import {
  BrowserRouter,
  Route,
  Link,
  Switch  
} from 'react-router-dom'

import Layout from './components/layout/layout';
import AddDevice from './components/device/addDevice';
import './App.css'

class App extends Component {
  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <Switch>
            <Route path='/' exact component={Layout}/>
            <Route path='/add-device' exact component={AddDevice}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
