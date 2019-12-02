import Notification from './ProfileNotification';
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class NotificationBoard extends React.Component {

  _isMount = false;
  state = {
    author: this.props.author,
    posts: [],
    msg: { readMsg: [], unreadMsg: [] },
  };

  componentDidMount() {
    this._isMount = true;
    this.getNotifications();
  }

  getNotifications = () => {

    axios
      .get(`/api/notifications/receiver/${this.state.author}`, this.props.tokenConfig())
      .then(msgs => {
        msgs.data.forEach(msg => {
          if (msg.read) {
            this.state.msg.readMsg.push(msg);
          } else {
            this.state.msg.unreadMsg.push(msg);
          }
        });
        this.state.msg.readMsg.sort(function(a, b){
          return Date.parse(b.time) - Date.parse(a.time);
        });
        this.state.msg.unreadMsg.sort(function(a, b) {
          console.log("log time");
          console.log(b, a);
        });
        this.setState({
          msg: this.state.msg
        })
        // this.setState({ msgServer: true });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    // console.log(this.state.msg);
    return (
      <Notification state={this.state.msg}/>
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

export default connect(mapStateToProps)(NotificationBoard);
