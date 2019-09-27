import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";

import "./style.css";
import axios from "axios";

class CustomNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("https://word-gues-game.herokuapp.com/api/v1/profile", {
        headers: {
          token
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            profile: res.data.profile
          });
        }
      });
  }

  logOut = () => {
    localStorage.clear("token");
    this.props.history.push("/login");
  };
  render() {
    const { profile } = this.state;
    return (
      <div>
        <Navbar color="light" light expand="md" fixed="top">
          <NavbarBrand className="nav-brand" href="/">
            HangMan
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink>{profile.username}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink>Score: {profile.total_score}</NavLink>
              </NavItem>
              <NavItem style={{ cursor: "pointer" }}>
                <NavLink onClick={this.logOut}>LogOut</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(CustomNav);
