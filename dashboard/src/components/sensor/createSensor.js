import React, { Component } from "react";

class CreateSensor extends Component {
  constructor() {
    super();
  }

  getValue() {

  }

  getUnit() {

  }

  onValueChange(e) {

  }

  onUnitChange(e) {

  }

  render() {
    return(
      <div>
        <input type="text" name="value" onChange={this.onValueChange.bind(this)} placeholder="sensor value" />
        <input type="text" name="unit" onChange={this.onUnitChange.bind(this)} placeholder="sensor unit"/>
      </div>
    )
  }
}

export default CreateSensor;