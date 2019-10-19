import React, { Component } from "react";
import Navbar from "../Navbar.jsx";
import "../../stylesheets/signup.scss";

class SignUp extends Component {
  state = {};
  render() {
    return (
      <div>
        <Navbar />
        <div className="form-container">
          <form action="">
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
                type="password"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
            <div>
              <div className="tab">
                <span>
                  <input type="radio" name="gender" /> Male
                </span>
                <span>
                  <input type="radio" name="gender" /> Female
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
