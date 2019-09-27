import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Spinner from "../hoc/spinner";

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

  userRegister = e => {
    e.preventDefault();
    const { username, gender, password } = this.state;
    this.setState({
      loading: true
    });
    axios
      .post("/api/v1/register", {
        username,
        gender,
        password
      })
      .then(res => {
        if (res.status === 201) {
          this.setState({
            loading: false
          });
          this.props.history.push("/login");
        }
      })
      .catch(error => {
        this.setState({
          loading: false
        });
        throw error;
      });
  };

  render() {
    const { username, password, gender, loading } = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/games");
    }
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
          <form className="form-horizontal" onSubmit={this.userRegister}>
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
                className="form-control login-btn"
                type="submit"
                onClick={this.userRegister}
              >
                {loading ? <Spinner /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Register;
