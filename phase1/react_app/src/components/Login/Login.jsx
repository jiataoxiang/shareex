import React, { Component } from "react";
import Navbar from "../Navbar.jsx";
import "../../stylesheets/login.css";

class Signin extends Component {
  state = {};
  render() {
    return (
      <div>
        <Navbar />
        <div className="form-container">
          <form action="">
            <div className="lock-container">
              <img
                src={process.env.PUBLIC_URL + "./img/lock.png"}
                width="40px"
                className="lock mx-auto"
                alt=""
              />
              <p>Sign In</p>
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
