import React, { Component } from "react";
import "../../stylesheets/user_profile.scss";
import { Redirect } from "react-router-dom";

class AdminProfile extends Component {
  state = {
    name: "Admin",
    avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    numVisited: 300,
    numHit: 256,
    numPosts: 3,
    numUsers: 3,
    userList: [{ id: 1 }, { id: 2 }, { id: 3 }],
    postList: [{ id: 1 }, { id: 2 }, { id: 3 }],
    mail: "coolguy@gmail.com",
    tel: "(647)-823-9988"
  };

  handleUserDelete = () => {
    const id = document.getElementById("userid");
    const user = this.state.userList.filter(
      user => user.id !== parseInt(id.value)
    );
    this.setState({
      userList: user,
      numUsers: user.length
    });
    if (user.length === this.state.userList.length) {
      console.log("This user id is not exist!");
    } else {
      console.log("Successful deleted the user with id: " + id.value);
    }
    id.value = "";
  };

  handlePostDelete = () => {
    const id = document.getElementById("postid");
    const post = this.state.postList.filter(
      post => post.id !== parseInt(id.value)
    );
    this.setState({
      postList: post,
      numPosts: post.length
    });
    if (post.length === this.state.postList.length) {
      console.log("This post id is not exist!");
    } else {
      console.log("Successful deleted the post with id: " + id.value);
    }
    id.value = "";
  };

  render() {
    if (!this.props.state.current_user) {
      return (<Redirect to="/" />)
    }
    return (
      <div className="user-profile-page">
        <button>
          <img
            id="AdminProfileCircle"
            src={this.state.avatar}
            alt="ProfilePicture"
          />
        </button>
        <div id="settingPanel">
          <div id="studentContainer">
            <p>Name: {this.state.name} </p>
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
