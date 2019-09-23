import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div className="cover-all">
        <div className="register-form">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/login">
                Login
              </Link>
            </li>
          </ul>
          <form className="form-horizontal">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input className="form-control" type="text" name="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control" type="password" name="password" />
            </div>
            <div className="form-group">
              <button className="form-control btn btn-warning" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
