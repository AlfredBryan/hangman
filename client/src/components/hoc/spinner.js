import React, { Component } from "react";
import "./style.css";

class Spinner extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default Spinner;
