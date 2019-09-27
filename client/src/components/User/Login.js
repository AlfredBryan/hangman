import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../hoc/spinner";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
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
    const { username, password } = this.state;
    this.setState({
      loading: true
    });
    axios
      .post("/api/v1/login", { username, password })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          this.setState({
            loading: false
          });
          localStorage.setItem("token", res.data.token);
          this.props.history.push("/games");
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
    const { username, password, loading } = this.state;
    const token = localStorage.getItem("token");
    if (token) {
      this.props.history.push("/games");
    }
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
          <form className="form-horizontal" onSubmit={this.userLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                className="form-control"
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <button
                className="form-control login-btn"
                type="submit"
                onClick={this.userLogin}
              >
                {loading ? <Spinner /> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
