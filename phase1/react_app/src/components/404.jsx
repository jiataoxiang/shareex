import React, { Component } from "react";
import "../stylesheets/404.css";
import { Link } from "react-router-dom";
class NotFound404 extends Component {
  state = {};
  render() {
    return (
      <div>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:700,900"
          rel="stylesheet"
        />
        <link type="text/css" rel="stylesheet" href="css/style.css" />
        <div id="notfound">
          <div class="notfound">
            <div class="notfound-404">
              <h1>404</h1>
              <h2>Page not found</h2>
            </div>
            <a>
              <Link to={"./"}>Go to Home Page</Link>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound404;
