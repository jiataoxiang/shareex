import Follower from './Follower';
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class FollowerBoard extends React.Component {
  _isMount = false;
  state = {
    author: this.props.author,
    followers: [],
    following: []
  };


  componentDidMount() {
    this._isMount = true;
    this.getUserInfo();
  }

  getUserInfo = () => {
    axios.get(`/api/users/${this.state.author}`, this.props.tokenConfig()).then(user => {
      user = user.data;
      console.log(user);
      if(this._isMount){
        this.setState({
          followers: user.followers,
          following: user.following
        });
      }
    });
  };

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    const followers = this.state.followers;
    const following = this.state.following;
    return (
      <div className="row">
        <div className="col-sm-6">
          <div className="follower-board">
            <h3> Followers</h3>
            <br />
            {followers.length !== 0 ? (
              followers.map(follower => {
                return <Follower key={uid(Math.random())} follow={follower} />;
              })
            ) : (
              <h4 className="text-center">No Follower</h4>
            )}
          </div>
        </div>
        <div className="col-sm-6">
          <div className="follower-board">
            <h3> Following</h3>
            <br />
            {following.length !== 0 ? (
              following.map(follow => {
                return <Follower key={uid(Math.random())} follow={follow} />;
              })
            ) : (
              <h4 className="text-center">No Following</h4>
            )}
          </div>
        </div>
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

export default connect(mapStateToProps)(FollowerBoard);
