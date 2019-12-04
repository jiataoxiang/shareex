import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class User extends Component {

  state = {};

  // get link based on user id
  getLink = () => {
    if (this.props.current_user._id === this.props.id) {
      return '/userprofile';
    }
    return '/otherprofile/' + this.props.id;
  };

  render() {
    return (
      <div className="user-component">
        <Link
          to={this.getLink()}
        >
          <div className="row">
            <div className="col-md-2 avatar-container">
              <img className="user-avatar" src={this.props.avatar} alt="" />
            </div>
            <div className="col-md-10 info-container">
              <h3>{this.props.username}</h3>
              <p>{this.props.email}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  tokenConfig: () => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    // If token, add to headers
    if (state.auth.token) {
      config.headers['x-auth-token'] = state.auth.token;
    }
    return config;
  },
});

export default connect(mapStateToProps)(User);
