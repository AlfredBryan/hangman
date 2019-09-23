import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./style.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      gender: "",
      password: "",
      loading: false
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  userLogin = e => {
    e.preventDefault();
    const { username, gender, password } = this.state;
    this.setState({
      loading: true
    });
    axios
      .post("http://localhost:4000/api/v1/register", {
        username,
        gender,
        password
      })
      .then(res => {
        console.log(res);
      });
  };

  render() {
    const { username, password, gender } = this.state;
    console.log(gender);
    return (
      <div className="cover-all">
        <div className="register-form">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link className="nav-link active" to="/">
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>
          <form className="form-horizontal" onSubmit={this.userLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                type="text"
                value={username}
                onChange={this.handleChange}
                name="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                className="form-control"
                type="text"
                value={gender}
                onChange={this.handleChange}
                name="gender"
              >
                <option>--Select--</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={this.handleChange}
                name="password"
              />
            </div>
            <div className="form-group">
              <button
                className="form-control btn btn-warning"
                type="submit"
                onClick={this.userLogin}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
