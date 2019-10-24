import React from "react";
import "../../stylesheets/UserProfile.scss";
import Post from "../Post";
import { lorem, rand_string } from "../../lib/util";
import { uid } from "react-uid";

class UserProfile extends React.Component {
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
        <div id="banner">
          <img
            className="bannerPic"
            src={process.env.PUBLIC_URL + "./img/banner.jpg"}
            alt="Banner"
          />
        </div>

        <div id="profileStats">
          <ul>
            <li>
              Tweets
              <br />
              <span className="profileStatsNumber">478</span>
            </li>
            <li>
              Followers
              <br />
              <span className="profileStatsNumber">23K</span>
            </li>
            <li>
              Following
              <br />
              <span className="profileStatsNumber">12</span>
            </li>
            <li>
              Likes
              <br />
              <span className="profileStatsNumber">10.3K</span>
            </li>
          </ul>
        </div>
        <div className="container">
          <div id="profileInfo">
            <h2>Name: super JATO</h2>
            <p>Skill: hahahahaha</p>
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
          <img
            id="bigProfilePicCircle"
            src={process.env.PUBLIC_URL + "./img/User_Avatar.png"}
            alt="ProfilePicture"
          />
        </div>
      </div>
    );
  }
}

export default UserProfile;
