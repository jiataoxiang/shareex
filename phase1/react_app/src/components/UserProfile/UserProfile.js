import React from "react";
import "../../stylesheets/UserProfile.scss";
import Post from "../Post";
import { lorem, rand_string } from "../../lib/util";
import { uid } from "react-uid";
import Popup from "./Popup";


class UserProfile extends React.Component {
  state = {
    username: "super JATO",
    banner: process.env.PUBLIC_URL + "./img/banner.jpg",
    avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    posts: [1,2,3,4,5],
    follower: 373,
    following: 309,
    likes: 311,
    motto: "hahahahahaha",
    showPop: false
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


  render() {
    const rand_images = [];
    for (let j = 0; j < 10; j++) {
      const tmp = [];
      for (let i = 0; i < 5; i++) {
        tmp.push("https://picsum.photos/seed/" + rand_string() + "/200/300");
      }
      rand_images.push(tmp);
    }
    // Construct Post list
    // In phase 2, data should come from server api
    const posts = [];
    for (let i = 0; i < 5; i++) {
      posts.push(
        <Post
          key={uid(rand_string())}
          title={lorem.generateSentences(1)}
          content={lorem.generateParagraphs(2)}
          images={rand_images[i]}
        />
      );
    }


    return (
      <div className="UserProfile">
        <div>
          {this.state.showPop ?
            <Popup
              header='You can change your avatar here'
              closePopup={this.closePopup.bind(this)}
            />
            : <img
              className="bannerPic"
              src={this.state.banner}
              alt="Banner"
            />
          }

        </div>

        <div id="profileStats">
          <ul>
            <li>
              Posts
              <br />
              <span className="profileStatsNumber">{this.state.posts.length}</span>
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
          <div id="profileInfo">
            <h2>Name: {this.state.username}</h2>
            <p>Motto: {this.state.motto}</p>
            <p>I'm powerful</p>
            <p>
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
              从前有座山，山里有座庙，庙里有个小和尚在讲故事。
            </p>
          </div>
          <div className="timeline">
            <div className="post">
              <h3 className="timelineheader">Posts</h3>
              {posts}
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
