import React, { Component } from 'react';
import '../stylesheets/404.css';
import { Link } from 'react-router-dom';
class NotFound404 extends Component {
  state = {};
  render() {
    return (
      <div className="not-found-page">
        <div className="notfound-container">
          <div className="notfound-main">
            <h1>404</h1>
            <h2>Page not found</h2>
          </div>
          <Link className="btn btn-danger btn-lg home-btn" to={'/'}>
            <strong>Go to Home Page</strong>
          </Link>
        </div>
      </div>
    );
  }
}

export default NotFound404;
