import React, { Component } from "react";
import "../../stylesheets/admin_profile.scss";
import { Redirect } from "react-router-dom";
import Dashboard from "./AdminProfileDashboard";
import FindUser from "./AdminProfileFindUser";
import FindPost from "./AdminProfileFindPost";
import Notification from "./AdminProfileNotification";

class AdminProfile extends Component {
  // TODO: connect to server, get info from API
  state = {
    avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    nickname: "Admin",
    mail: "place@holder.com",
    tel: "(647)-823-9988",
    tabState: 0,
      
    numVisited: 300,
    numHit: 256,
    numPosts: 3,
    numUsers: 3,
    user_list: [{ id: 1 }, { id: 2 }, { id: 3 }],
    post_list: [{ id: 1 }, { id: 2 }, { id: 3 }],
  };

  tabLeft = [];
  tabRight = [<Dashboard />, <FindUser />, <FindPost />, <Notification />];
    
  changeTabRight = (num) => {
      this.setState({tabState: num});
  }

  handleUserDelete = () => {
    // TODO: connect to server, update information
    // When delete a user, delete related info as well, or show a warning.
    const id = document.getElementById("userid");
    const user = this.state.user_list.filter(user => user.id !== id.value);
    this.props.state.setAppState("users", user);
    if (user.length === this.state.user_list.length) {
      console.log("This user id is not exist!");
    } else {
      console.log("Successful deleted the user with id: " + id.value);
      this.props.state.current_user.numUsers -= 1;
      const posts = this.props.state.posts.filter(
        post => post.author_id !== id.value
      );
      this.props.state.setAppState("posts", posts);
      const user_posts = this.props.state.posts.filter(
        post => post.author_id === id.value
      );
      this.props.state.current_user.numPosts -= user_posts.length;
      for (let i = 0; i < user_posts.length; i++) {
        const attachments = this.props.state.attachments.filter(
          attachment => attachment.post_id !== user_posts[i].id
        );
        this.props.state.setAppState("attachments", attachments);
        const comments = this.props.state.comments.filter(
          comment => comment.post_id !== user_posts[i].id
        );
        this.props.state.setAppState("comments", comments);
      }
    }
    id.value = "";
  };

  handlePostDelete = () => {
    // TODO: connect to server, update information
    // When delete a post, delete the related info as well, or show a warning.
    const id = document.getElementById("postid");
    const post = this.state.post_list.filter(post => post.id !== id.value);
    this.props.state.setAppState("posts", post);
    if (post.length === this.state.post_list.length) {
      console.log("This post id is not exist!");
    } else {
      console.log("Successful deleted the post with id: " + id.value);
      this.props.state.current_user.numPosts -= 1;
      const post = this.props.state.posts.filter(post => post.id === id.value);
      const user = this.props.state.users.filter(
        user => user.id === post[0].author_id
      );
      user[0].numPosts -= 1;
      const attachments = this.props.state.attachments.filter(
        attachment => attachment.post_id !== post[0].id
      );
      this.props.state.setAppState("attachments", attachments);
      const comments = this.props.state.comments.filter(
        comment => comment.post_id !== post[0].id
      );
      this.props.state.setAppState("comments", comments);
    }
    id.value = "";
  };

  componentDidMount() {
    // TODO: replace the following initialization code in phase 2, connect to server and get real data
    // Current user info
    const currentUser = this.props.state.current_user;
    if (currentUser) {
      this.setState({
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
        mail: currentUser.mail,
        tel: currentUser.tel,
        numVisited: currentUser.numVisited,
        numHit: currentUser.numHit,
        numPosts: currentUser.numPosts,
        numUsers: currentUser.numUsers,
        user_list: this.props.state.users,
        post_list: this.props.state.posts
      });
    }
  }

  render() {
    if (!this.props.state.current_user) {
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
                    <p>Email: {this.state.mail} </p>
                    <p>Telephone: {this.state.tel} </p>
                  </div>
                  <div id="option-tab">
                    <div className="btn-group-vertical">
                        <button type="button" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(0)}>
                            Dashboard
                        </button>
                        <button type="button" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(1)}>
                            Find User
                        </button>
                        <button type="button" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(2)}>
                            Find Post
                        </button>
                        <button type="button" 
                            className="btn btn-light" 
                            onClick={() => this.changeTabRight(3)}>
                            Notification
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

export default AdminProfile;
