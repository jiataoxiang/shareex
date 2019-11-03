import React, { Component } from "react";
import "../../stylesheets/user_profile.scss";
import "../../stylesheets/admin_profile.scss";
import { Redirect } from "react-router-dom";
const myVar = {
  showUserWarn: false,
  showUserSuccess: false,
  showPostWarn: false,
  showPostSuccess: false,
  userWarnMessage: "This user id is not exist!",
  userSuccessMessage: "Successful deleted the user",
  postWarnMessage: "This post id is not exist!",
  postSuccessMessage: "Successful deleted the user"
};
class AdminProfile extends Component {
  // TODO: connect to server, get info from API
  state = {
    nickname: "Admin",
    avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    numVisited: 300,
    numHit: 256,
    numPosts: 3,
    numUsers: 3,
    user_list: [{ id: 1 }, { id: 2 }, { id: 3 }],
    post_list: [{ id: 1 }, { id: 2 }, { id: 3 }],
    mail: "coolguy@gmail.com",
    tel: "(647)-823-9988",
  };

  handleUserDelete = () => {
    // TODO: connect to server, update information
    // When delete a user, delete related info as well, or show a warning.
    const id = document.getElementById("userid");
    const user = this.state.user_list.filter(user => user.id !== id.value);
    this.props.state.setAppState("users", user);
    if (user.length === this.state.user_list.length) {
      console.log("This user id is not exist!");
      myVar.showUserWarn = true;
      myVar.showUserSuccess = false;
      myVar.showPostWarn = false;
      myVar.showPostSuccess = false;
    } else {
      console.log("Successful deleted the user with id: " + id.value);
      myVar.showUserWarn = false;
      myVar.showUserSuccess = true;
      myVar.showPostWarn = false;
      myVar.showPostSuccess = false;
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
      myVar.showUserWarn = false;
      myVar.showUserSuccess = false;
      myVar.showPostWarn = true;
      myVar.showPostSuccess = false;
    } else {
      console.log("Successful deleted the post with id: " + id.value);
      myVar.showUserWarn = false;
      myVar.showUserSuccess = false;
      myVar.showPostWarn = false;
      myVar.showPostSuccess = true;
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
      <div className="user-profile-page admin-profile-page">
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div id="settingPanel">
                <img id="AdminProfileCircle" src={this.state.avatar} alt="" />
                <div id="studentContainer">
                  <p>Name: {this.state.nickname} </p>
                  <br />
                  <p>Email: {this.state.mail} </p>
                  <br />
                  <p>Telephone: {this.state.tel} </p>
                  <br />
                  <div className="input-group mb-3">
                    <div>
                      <input
                        id="userid"
                        name="userid"
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="user id"
                      />
                    </div>
                    <div className="input-group-append">
                      <button
                        className="input-group-text"
                        onClick={this.handleUserDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {myVar.showUserWarn ? (
                    <div>
                      <p>
                        {myVar.userWarnMessage}
                      </p>
                    </div>
                  ) : null
                  }
                  {myVar.showUserSuccess ? (
                    <div>
                      <p>
                        {myVar.userSuccessMessage}
                      </p>
                    </div>
                  ) : null
                  }
                  <br />
                  <div className="input-group mb-3">
                    <div>
                      <input
                        id="postid"
                        name="postid"
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        placeholder="post id"
                      />
                    </div>
                    <div className="input-group-append">
                      <button
                        className="input-group-text"
                        onClick={this.handlePostDelete}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {myVar.showPostWarn ? (
                    <div>
                      <p>
                        {myVar.postWarnMessage}
                      </p>
                    </div>
                  ) : null
                  }
                  {myVar.showPostSuccess ? (
                    <div>
                      <p>
                        {myVar.postSuccessMessage}
                      </p>
                    </div>
                  ) : null
                  }
                  <br />
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div id="stats">
                <div className="row">
                  <div className="col stat">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Number Visited:</h5>
                        <p className="">{this.state.numVisited}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col stat">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Number Hit:</h5>
                        <p className="">{this.state.numHit}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col stat">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Number Posts:</h5>
                        <p className="">{this.state.numPosts}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col stat">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Number Users:</h5>
                        <p className="">{this.state.numUsers}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminProfile;
