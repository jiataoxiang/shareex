import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../stylesheets/login.scss";
import $ from "jquery";

class Login extends Component {
  state = {};

  signin = e => {
    // TODO: connect to server, need signIn info from database
    // for debugging admin code
    // this.props.state.setAppState("current_user", this.props.state.users[0]);
    // return;
    e.preventDefault();
    const username = $("input[name='username']").val();
    const password = $("input[name='password']").val();

    // the following code should be replaced with real authentication code in phase2
    // Get authentication from server
    // Send username and password to server
    // code below requires server call
    const users = this.props.state.users;
    const signin_user = users.filter(user => user.username === username);
    console.log(signin_user);

    if (signin_user.length === 1) {
      console.log("User found");
      console.log(password);
      if (signin_user[0].password === password) {
        console.log("Password correct, Signed in");
        this.props.state.setAppState("current_user", signin_user[0]);
        // redirect to Home page when logged in
        this.props.history.push("/");
      } else {
        console.log("Failed to sign in, password wrong");
        alert("Password is wrong");
      }
    } else if (signin_user.length === 0) {
      console.log("User doesn't exist");
      alert("User doesn't exist");
    } else {
      console.log("Error!!! More than one user has the same username");
    }
  };

  componentDidMount() {
    // If alreadly loged in, go to home page.
    if (this.props.state.current_user) {
        alert("You already loged in!")
        this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="login-page">
        <div className="form-container">
          <form action="" onSubmit={this.signin}>
            <div className="lock-container">
              <img
                src={"./img/lock.png"}
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

export default withRouter(Login);
