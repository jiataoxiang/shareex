import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../../stylesheets/login.scss";
import $ from "jquery";

class Signin extends Component {
  state = {
    users: {
      user1: {
        password: "password1"
      },
      user2: {
        password: "password2"
      }
    }
  };

  constructor(props) {
    super(props);
    this.signin = this.signin.bind(this);
  }

  signin(e) {
    e.preventDefault();
    const username = $("input[name='username']").val();
    const password = $("input[name='password']").val();
    if (this.state.users[username]) {
      console.log("User found");
      if (this.state.users[username]["password"] === password) {
        alert("Signin Succeeded");
        console.log("Signed in");
      } else {
        console.log("failed to sign in");
      }
    } else {
      console.log("User doesn't exist");
    }
  }

  componentDidMount() {
    // console.log(this.state);
    // console.log(this.props);
  }
  render() {
    return (
      <div className="login-page">
        <div className="form-container">
          <form action="" onSubmit={this.signin}>
            <div className="lock-container">
              <img
                src={process.env.PUBLIC_URL + "./img/lock.png"}
                width="40px"
                className="lock mx-auto"
                alt=""
              />
              <h3>Sign In</h3>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Username
                </span>
              </div>
              <input
                name="username"
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Password
                </span>
              </div>
              <input
                name="password"
                type="password"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-md btn-block">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Signin;
