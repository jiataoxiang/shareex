import React from "react";
<<<<<<< HEAD:phase1/react_app/src/components/UserProfiling/UserProfiling.js
import "../../stylesheets/UserProfiling.scss";
=======
// import Navbar from "../Navbar.jsx";
import "../../stylesheets/UserProfile.scss";
>>>>>>> bb764f7f40442f70d0548e5fa957a96f7955328a:phase1/react_app/src/components/UserProfile/UserProfile.js
import Post from "../Post";
import { lorem, rand_string } from "../../lib/util";


class UserProfile extends React.Component {
  render() {
    const rand_images = [];
    for (let j = 0; j < 2; j++) {
      const tmp = [];
      for (let i = 0; i < 5; i++) {
        tmp.push("https://picsum.photos/seed/" + rand_string() + "/200/300");
      }
      rand_images.push(tmp);
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
              <Post
                title={lorem.generateSentences(1)}
                content={lorem.generateParagraphs(2)}
                images={rand_images[0]}
              />
              <Post
                title={lorem.generateSentences(1)}
                content={lorem.generateParagraphs(2)}
                images={rand_images[1]}
              />
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
