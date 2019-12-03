import React, { Component } from 'react';
import '../../stylesheets/admin_profile.scss';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import Dashboard from './AdminProfileDashboard';
import FindUser from './AdminProfileFindUser';
import FindPost from './AdminProfileFindPost';
import Notification from './ProfileNotification';

class AdminProfile extends Component {
  state = {
    avatar: process.env.PUBLIC_URL + './img/User_Avatar.png',
    nickname: 'Admin',
    email: 'place@holder.com',
    tabState: 0,
    msgServer: false,
  };

  // Contains notifications.
  msg = {
      readMsg: [], 
      unreadMsg: []
  }

  tabLeft = [];
  getTabButtons = () => {
    this.tabLeft.push(document.getElementById('button-1'));
    this.tabLeft.push(document.getElementById('button-2'));
    this.tabLeft.push(document.getElementById('button-3'));
    this.tabLeft.push(document.getElementById('button-4'));
  };

  tabRight = [<Dashboard />, <FindUser />, <FindPost />, <Notification state={this.msg} />];
  // Change what is rendered on the right.
  changeTabRight = num => {
    if (num === 3 && !this.state.msgServer) {
      alert('Please be patient, notifications are still loading');
    } else if (num === 3) {
      this.tabLeft.forEach(button => {
        button.classList.remove('btn-selected');
      });
      this.tabLeft[num].classList.add('btn-selected');
      this.setState({ tabState: num });

      this.hideBadge();
    } else {
      this.tabLeft.forEach(button => {
        button.classList.remove('btn-selected');
      });
      this.tabLeft[num].classList.add('btn-selected');
      this.setState({ tabState: num });
        
      this.getNotifications();
    }
  };

  // Hide the new badge for notifications.
  hideBadge = () => {
    const msg_badge = document.getElementById('unread-notifications');
    msg_badge.setAttribute('hidden', true);
  };

  // Show the new badge for notifications.
  showBadge = () => {
    const msg_badge = document.getElementById('unread-notifications');
    msg_badge.removeAttribute('hidden');
  };

  // Read notifications from server.
  getNotifications = () => {
    this.hideBadge();
    this.setState({ msgServer: false });

    axios
      .get(
        `/api/notifications/receiver/${this.props.auth.user._id}`, this.tokenConfig()
      )
      .then(msgs => {
        this.msg.readMsg = [];
        this.msg.unreadMsg = [];
        
        msgs.data.forEach(msg => {
          if (msg.read) {
            this.msg.readMsg.push(msg);
          } else {
            this.showBadge();
            this.msg.unreadMsg.push(msg);
          }
        });
      }).then(result => {
        this.setState({ 
          msgServer: true 
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

    // Headers
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    // If token, add to headers
    if (token) {
      config.headers['x-auth-token'] = token;
    } else {
      window.location.href = '/';
    }

    return config;
  };

  componentDidMount() {
    this.getTabButtons();

    const currentUser = this.props.auth.user;
    if (currentUser) {
      this.setState({
        avatar: currentUser.avatar,
        nickname: currentUser.username,
        email: currentUser.email,
      });

      this.getNotifications();
    }
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/" />;
    } else if (!this.props.auth.user.admin) {
      return <Redirect to="/" />;
    }

    return (
      <div className="user-profile-page admin-profile-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4">
              <div id="left-tab">
                <img id="AdminProfileCircle" src={this.state.avatar} alt="" />
                <div id="user-info">
                  <p>Nickname: {this.state.nickname} </p>
                  <p>Email: {this.state.email} </p>
                </div>
                <div id="option-tab">
                  <div className="list-group">
                    <button
                      type="button"
                      id="button-1"
                      className="list-group-item list-group-item-action btn-selected"
                      onClick={() => this.changeTabRight(0)}
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      id="button-2"
                      className="list-group-item list-group-item-action"
                      onClick={() => this.changeTabRight(1)}
                    >
                      Find User
                    </button>
                    <button
                      type="button"
                      id="button-3"
                      className="list-group-item list-group-item-action"
                      onClick={() => this.changeTabRight(2)}
                    >
                      Find Post
                    </button>
                    <button
                      type="button"
                      id="button-4"
                      className="list-group-item list-group-item-action"
                      onClick={() => this.changeTabRight(3)}
                    >
                      Notification
                      <span id="unread-notifications" className="badge badge-danger">
                        New
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div id="display-tab">{this.tabRight[this.state.tabState]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// getting from reducers (error and auth reducers)
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  auth: state.auth,
});

export default connect(mapStateToProps)(AdminProfile);
