import React, { Component } from "react";
import "../../stylesheets/signup.scss";
import $ from "jquery";

class SignUp extends Component {
  state = {
    users: {}
  };
  constructor(props) {
    super(props);
    this.signup = this.signup.bind(this);
  }

  signup(e) {
    e.preventDefault();
    const username = $("input[name='username']").val();
    const email = $("input[name='email']").val();
    const password = $("input[name='password']").val();
    const gender = $("input[name='gender']").val();

    if (username === "" || password === "" || gender === "" || email === "") {
      console.log("All inputs must be filled in");
      alert("All inputs must be filled in");
    } else {
      // The following code should be replaced with code connecting to server and create an account in database
      if (this.state.users[username]) {
        console.log("Username already exists");
        alert("Username already exists");
      } else {
        const users = this.state.users;
        const user = {};
        user["email"] = email;
        user["password"] = password;
        user["gender"] = gender;
        users[username] = user;
        this.setState(users);
      }
    }
    console.log(this.state);
  }

  render() {
    return (
      <div className="signup-page">
        <div className="form-container">
          <form action="" onSubmit={this.signup}>
            <h2 id="signup-title">Sign Up</h2>
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
                  Email
                </span>
              </div>
              <input
                name="email"
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
            <div>
              <div className="tab">
                <span>
                  <input type="radio" name="gender" value="male" /> Male
                </span>
                <span>
                  <input type="radio" name="gender" value="female" /> Female
                </span>
              </div>
            </div>
            <button type="submit" className="btn btn-success btn-md btn-block">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
