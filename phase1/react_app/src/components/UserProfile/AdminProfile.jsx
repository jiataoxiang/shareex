import React, { Component } from "react";
import "../../stylesheets/user_profile.scss";
import { Redirect } from "react-router-dom";

class AdminProfile extends Component {
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
    tel: "(647)-823-9988"
  };

  handleUserDelete = () => {
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
    // The code below are temporary code for randomly generating some post content and recommendations
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
      console.log(currentUser);
    }
  }

  render() {
    if (!this.props.state.current_user) {
      return <Redirect to="/" />;
    }
    return (
      <div className="user-profile-page">
        <button>
          <img id="AdminProfileCircle" src={this.state.avatar} alt="" />
        </button>
        <div id="settingPanel">
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
          </div>
        </div>
        <div id="carouselContainer">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="0"
                className="active"
              />
              <li data-target="#carouselExampleIndicators" data-slide-to="1" />
              <li data-target="#carouselExampleIndicators" data-slide-to="2" />
              <li data-target="#carouselExampleIndicators" data-slide-to="3" />
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="Panel">
                  <p className="PanelText">
                    number visited: {this.state.numVisited}
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <div className="Panel">
                  <p className="PanelText">number hit: {this.state.numHit}</p>
                </div>
              </div>
              <div className="carousel-item">
                <div className="Panel">
                  <p className="PanelText">
                    number posts: {this.state.numPosts}
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <div className="Panel">
                  <p className="PanelText">
                    number users: {this.state.numUsers}
                  </p>
                </div>
              </div>
            </div>
            <a
              className="carousel-control-prev"
              href={"#carouselExampleIndicators"}
              role="button"
              data-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="sr-only">Previous</span>
            </a>
            <a
              className="carousel-control-next"
              href={"#carouselExampleIndicators"}
              role="button"
              data-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminProfile;
