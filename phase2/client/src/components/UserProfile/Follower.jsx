import React from 'react';
import axios from 'axios';
import '../../stylesheets/follower.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Follower extends React.Component {
  _isMount = false;

  state = {
    follow: this.props.follow,
  };

  componentDidMount() {
    this._isMount = true;
    //get follow avatar and name
    axios
      .get(`/api/users/${this.state.follow}`, this.props.tokenConfig())
      .then(follower => {
        if (this._isMount) {
          this.setState({
            follower_id: follower.data._id,
            follower_name: follower.data.username,
            follower_avatar: follower.data.avatar,
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  redirectProfile = () => {
    this.props.history.push({
      pathname: '/otherprofile/' + this.state.follow,
    });
  };

  render() {
    return (
      <div>
        <div className="follower" onClick={this.redirectProfile}>
          <img src={this.state.follower_avatar} className="avatar-image" alt="avatar" />
          <span className="username-text">{this.state.follower_name}</span>
        </div>
        <br />
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

export default connect(mapStateToProps)(withRouter(Follower));
