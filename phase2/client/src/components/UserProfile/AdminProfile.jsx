import React, { Component } from "react";
import "../../stylesheets/admin_profile.scss";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import Dashboard from "./AdminProfileDashboard";
import FindUser from "./AdminProfileFindUser";
import FindPost from "./AdminProfileFindPost";
import Notification from "./profileNotification";

class AdminProfile extends Component {
    // TODO: connect to server, get info from API
    state = {
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
        nickname: "Admin",
        email: "place@holder.com",
        tabState: 0,
        msg: {readMsg: [], unreadMsg: []}
    };

    tabLeft = [];
    getTabButtons = () => {
        this.tabLeft.push(document.getElementById("button-1"));
        this.tabLeft.push(document.getElementById("button-2"));
        this.tabLeft.push(document.getElementById("button-3"));
        this.tabLeft.push(document.getElementById("button-4"));
    }

    tabRight = [<Dashboard />, <FindUser />, <FindPost />, 
              <Notification state={this.state.msg} />];
    changeTabRight = (num) => {
        this.tabLeft.forEach((button) => {
            button.classList.remove("btn-selected");
        });
        
        this.tabLeft[num].classList.add("btn-selected");
        this.setState({tabState: num});
        
        if (num === 3) {
            const msg_badge = document.getElementById("unread-notifications");
            msg_badge.setAttribute("hidden", true);
            this.readNotifications();
        }
    }
  
    getNotifications = () => {
        const msg_badge = document.getElementById("unread-notifications");
        msg_badge.setAttribute("hidden", true);
        
        axios.get(
            `/api/notifications/receiver/${this.props.auth.user._id}`
        ).then(msgs => {
            msgs.data.forEach((msg) => {
                if (msg.read) {
                    this.state.msg.readMsg.push(msg);
                } else {
                    this.state.msg.unreadMsg.push(msg);
                }
            })
        }).then(() => {
            if (this.state.msg.unreadMsg.length) {
                msg_badge.removeAttribute("hidden");
            } else {
                msg_badge.setAttribute("hidden", true);
            }
        }).catch(error => {
            console.log(error);
        });
    }
    
    readNotifications = () => {
        axios.post(
            `/api/notifications/read/${this.props.auth.user._id}`
        ).then(result => {
            if (!result) {
                console.log("Notifications count not be read.");
            } else {
                console.log(result.data.nModified + " new notifications read.");
                const msg_badge = document.getElementById("unread-notifications");
                msg_badge.setAttribute("hidden", true);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getTabButtons();
        
        const currentUser = this.props.auth.user;
        if (currentUser) {
            this.setState({
                avatar: currentUser.avatar,
                nickname: currentUser.username,
                email: currentUser.email
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
          <div className="user-profile-page admin-profile-page container">
            <div className="row">
              <div className="col-md-5">
                <div id="left-tab">
                  <img id="AdminProfileCircle" src={this.state.avatar} alt="" />
                    <div id="user-info">
                      <p>Nickname: {this.state.nickname} </p>
                      <p>Email: {this.state.email} </p>
                    </div>
                    <div id="option-tab">
                      <div className="btn-group-vertical">
                        <button type="button" 
                            id="button-1" 
                            className="btn btn-light btn-selected" 
                            onClick={() => this.changeTabRight(0)}>
                            Dashboard
                        </button>
                        <button type="button" 
                            id="button-2" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(1)}>
                            Find User
                        </button>
                        <button type="button" 
                            id="button-3" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(2)}>
                            Find Post
                        </button>
                        <button type="button" 
                            id="button-4" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(3)}>
                            Notification
                            <span id="unread-notifications" 
                                className="badge badge-danger">
                                New
                            </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              <div className="col-md-7">
                <div id="display-tab">
                  {this.tabRight[this.state.tabState]}
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
  auth: state.auth
});

export default connect(mapStateToProps)(AdminProfile);
