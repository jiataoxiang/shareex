import React from "react";
import "../../stylesheets/user_profile.scss";
import Post from "../Post";
import { rand_string } from "../../lib/util";
import { Link } from "react-router-dom";
import { uid } from "react-uid";
import Popup from "./Popup";

class UserProfile extends React.Component {
  state = {
    username: "super JATO",
    banner: process.env.PUBLIC_URL + "./img/banner.jpg",
    avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    posts: [1, 2, 3, 4, 5],
    follower: 373,
    following: 309,
    likes: 311,
    motto: "",
    description: "",
    showPop: false,
    post_list: []
  };

  handlePopup = () => {
    if (this.state.showPop === false) {
      this.setState({
        showPop: true
      });
    }
  };

  closePopup = () => {
    if (this.state.showPop === true) {
      this.setState({
        showPop: false
      });
    }
  };

  componentDidMount() {}

  getPosts = () => {
    // find all posts belonging to current user
    const posts_display = [];
    if (this.props.state.posts) {
      const posts = this.props.state.posts.filter(
        post => post.author_id === this.props.state.current_user
      );

      if (posts) {
        for (let i = 0; i < posts.length; i++) {
          // find all attachments
          const attachments = this.props.state.attachments.filter(
            attachment => attachment.post_id === posts[i].id
          );
          posts_display.push(
            <Post
              key={uid(rand_string())}
              post={posts[i]}
              attachments={attachments}
            />
          );
        }
      }
    }

    return posts_display;
  };

  render() {
    return (
      <div className="user-profile-page">
        <div>
          {this.state.showPop ? (
            <Popup
              header="You can change your avatar here"
              closePopup={this.closePopup.bind(this)}
            />
          ) : (
            <img className="bannerPic" src={this.state.banner} alt="Banner" />
          )}
        </div>

        <div id="profileStats">
          <ul className="text-center">
            <li>
              Posts
              <br />
              <span className="profileStatsNumber">
                {this.state.posts.length}
              </span>
            </li>
            <li>
              Followers
              <br />
              <span className="profileStatsNumber">{this.state.follower}</span>
            </li>
            <li>
              Following
              <br />
              <span className="profileStatsNumber">{this.state.following}</span>
            </li>
            <li>
              Likes
              <br />
              <span className="profileStatsNumber">{this.state.likes}</span>
            </li>
          </ul>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="sticky-top">
                <div className="space"></div>
                <div id="profileInfo">
                  <h2>Name: {this.state.username}</h2>
                  <p>Motto: {this.state.motto}</p>
                  <p>{this.state.description}</p>
                  <Link to="/prof_setting" id="profile-setting-btn">
                    <button className="btn btn-light btn-block">
                      Profile Setting
                    </button>
                  </Link>
                  <button className="btn btn-success btn-block">
                    <strong>Follow</strong>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="timeline">
                <h3 className="timelineheader">Posts</h3>
                {this.getPosts().map(post => {
                  return post;
                })}
              </div>
            </div>
          </div>
          <button>
            <img
              id="bigProfilePicCircle"
              src={this.state.avatar}
              alt="ProfilePicture"
              onClick={this.handlePopup.bind(this)}
            />
          </button>
        </div>
      </div>
    );
  }
}

export default UserProfile;
