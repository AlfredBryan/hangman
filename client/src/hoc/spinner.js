import React, { Component } from "react";
import "./style.css";

class spinner extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default spinner;
