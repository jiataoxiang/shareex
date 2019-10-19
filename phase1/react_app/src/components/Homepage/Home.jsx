import React, { Component } from "react";
import Navbar from "../Navbar.jsx";
import "../../stylesheets/home.css";

class Home extends Component {
  state = {};
  componentDidMount() {}
  render() {
    return (
      <div className="container">
        <Navbar />
        <div class="row no-gutters">
          <div class="col-12 col-sm-6 col-md-8">
            <h3>Posts</h3>
          </div>
          <div class="col-6 col-md-4">
            <h3>Recommendations</h3>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
