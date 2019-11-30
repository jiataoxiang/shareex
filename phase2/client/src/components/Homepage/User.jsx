import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class User extends Component {
  state = {};
  render() {
    return (
      <div className="user-component">
        <Link
          to={{
            pathname: '/otherprofile',
            state: {
              author: this.props.id,
            },
          }}
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

export default User;
