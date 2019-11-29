import React, { Component } from 'react';
import '../stylesheets/404.css';
import { Link } from 'react-router-dom';
class NotFound404 extends Component {
  state = {};
  render() {
    return (
      <div>
        <link
          href="https://fonts.googleapis.com/css?family=Montserrat:700,900"
          rel="stylesheet"
        />
        <div id="notfound" className="container text-center">
          <div className="notfound">
            <div className="notfound-404">
              <h1 className="num404">404</h1>
              <h2>Page not found</h2>
            </div>
            <Link className="home-link btn btn-danger" to={'./'}>
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound404;
