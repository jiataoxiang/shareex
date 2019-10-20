import React, { Component } from "react";
import Post from "../Post";
import "../../stylesheets/home.scss";

class Home extends Component {
  state = {};
  componentDidMount() {}
  render() {
    return (
      <div>
        <div className="container row">
          <div className="posts col-12 col-sm-6 col-md-8">
            <h3>Posts</h3>
            <Post />
            <Post />
          </div>
          <div className="recommendations col-6 col-md-4">
            <h4>Recommendations</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
