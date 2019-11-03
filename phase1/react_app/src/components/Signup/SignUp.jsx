import React, { Component } from "react";
import "../../stylesheets/signup.scss";
import $ from "jquery";
import { withRouter } from "react-router-dom";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";

class SignUp extends Component {
  state = {};

  signup = e => {
    e.preventDefault();
    const username = $("input[name='username']").val();
    const email = $("input[name='email']").val();
    const password = $("input[name='password']").val();
    const gender = $("input[name='gender']:checked").val();

    if (username === "" || password === "" || gender === "" || email === "") {
      console.log("All inputs must be filled in");
      alert("All inputs must be filled in");
    } else {
      // The following code should be replaced with code connecting to server and create an account in database
      // Check if user exists from server
      // code below requires server call
      const users = this.props.state.users;
      if (users.filter(user => user.username === username).length !== 0) {
        console.log("Username already exists");
        alert("Username already exists, change another one");
      } else {
        const user = {};
        user["email"] = email;
        user["password"] = password;
        user["gender"] = gender;
        user["username"] = username;
        user["avatar"] = "./img/User_Avatar.png";
        user["banner"] = "./img/banner.jpg";
        user["nickname"] = "Huskey";
        user["follower"] = 0;
        user["following"] = 0;
        user["likes"] = 0;
        user["numPosts"] = 0;
        user["tel"] = "";
        user["motto"] = "I like studying other!!";
        user["id"] = uid(rand_string());
        users.push(user);
        this.props.state.setAppState("users", users);
        console.log("user created and added to data");
        this.props.state.setAppState(
          "current_user",
          this.props.state.users.filter(user => user.username === username)[0]
        );
        this.props.history.push("/");
      }
    }
  };

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

            <div className="tab">
              <span>
                <input type="radio" name="gender" value="male" /> Male
              </span>
              <span>
                <input type="radio" name="gender" value="female" /> Female
              </span>
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

export default withRouter(SignUp);
