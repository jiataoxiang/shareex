import React from "react";
import "../../stylesheets/user_profile.scss";
import Post from "../Post";
import { lorem, rand_string } from "../../lib/util";
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

  componentDidMount() {
    // The code below are temporary code for randomly generating some post content and recommendations
    // TODO: replace the following initialization code in phase 2, connect to server and get real data
    const post_list = [];
    function getRandomImages(num) {
      const tmp = [];
      for (let i = 0; i < num; i++) {
        tmp.push("https://picsum.photos/seed/" + rand_string() + "/200/300");
      }
      return tmp;
    }

    for (let i = 0; i < 10; i++) {
      post_list.push({
        title: lorem.generateSentences(1),
        content: lorem.generateParagraphs(2),
        images: getRandomImages(5)
      });
    }
    const motto = lorem.generateSentences(1);
    const description = lorem.generateParagraphs(2);
    this.setState({
      post_list: post_list,
      motto: motto,
      description: description
    });
  }

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
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="timeline">
                <h3 className="timelineheader">Posts</h3>
                {this.state.post_list.map(post => {
                  return (
                    <Post
                      key={uid(rand_string())}
                      title={post.title}
                      content={post.content}
                      images={post.images}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          {/* <button>
            <img
              id="bigProfilePicCircle"
              src={this.state.avatar}
              alt="ProfilePicture"
              onClick={this.handlePopup.bind(this)}
            />
          </button> */}
        </div>
      </div>
    );
  }
}

export default UserProfile;
