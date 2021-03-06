import React from "react";
import "../../stylesheets/user_profile.scss";
import Post from "../Post";
import { rand_string } from "../../lib/util";
import { Link, Redirect } from "react-router-dom";
import { uid } from "react-uid";
import Popup from "./Popup";

class UserProfile extends React.Component {

  state = {
    showPop: false
  };

  handlePopup = () => {
    // Show the pop up window.
    if (this.state.showPop === false) {
      this.setState({
        showPop: true
      });
    }
  };

  closePopup = () => {
    // Close the pop up window.
    if (this.state.showPop === true) {
      this.setState({
        showPop: false
      });
    }
  };

  componentDidMount() {
    // The code below are temporary code for randomly generating some post content and recommendations
    // TODO: replace the following initialization code in phase 2, connect to server and get real data
    // Current user info
    const currentUser = this.props.state.current_user;
    if (currentUser) {
      this.setState({
        nickname: currentUser.nickname,
        banner: currentUser.banner,
        avatar: currentUser.avatar,
        follower: currentUser.follower,
        following: currentUser.following,
        likes: currentUser.likes,
        numPosts: currentUser.numPosts,
        motto: currentUser.motto
      });
      console.log(currentUser);
    }
  }

  getPosts = () => {
    // TODO: connect to server, get posts from server.
    // find all posts belonging to current user
    const posts_display = [];
    if (this.props.state.posts) {
      const posts = this.props.state.posts.filter(
        post => post.author_id === this.props.state.current_user.id
      );

      if (posts) {
        console.log(posts);
        for (let i = 0; i < posts.length; i++) {
          // find all attachments
          const attachments = this.props.state.attachments.filter(
            attachment => attachment.post_id === posts[i].id
          );
          posts_display.push(
            <Post
              key={uid(rand_string())}
              post={posts[i]}
              posts={posts}
              users={this.props.state.users}
              attachments={attachments}
              current_user={this.props.state.current_user}
              setAppState={this.props.state.setAppState}
            />
          );
        }
      }
    }
    return posts_display;
  };

  // Display the banner editing button.
  showBannerEditor = () => {
      const bannerButton = document.getElementById("banner-button-container");
      bannerButton.removeAttribute("hidden");
      bannerButton.classList.add("buttonDrop");
  };
  // Hide the banner editing button.
  hideBannerEditor = () => {
      const bannerButton = document.getElementById("banner-button-container");
      bannerButton.setAttribute("hidden",true);
      bannerButton.classList.remove("buttonDrop");
  };
  
  changeBannerPre = () => { document.getElementById("change-banner").click(); }
  // this function gets the temp url of the uploaded img
  // TODO: change the following code in phase 2, so that we keep the file
  changeBanner = (event) => {
    const inputFile = event.target.files[0]

    if (inputFile != null) {
      const isJPG = inputFile.type === 'image/jpeg';
      const isPNG = inputFile.type === 'image/png';

      if (!isJPG && !isPNG) {
        inputFile.status = 'error';
        console.log("You can only upload png or jpg files.");
      } else {
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({banner: imgReader.result});
          // save the new banner to mock data, change in phase 2
          this.props.state.current_user.banner = imgReader.result;
        });
        imgReader.readAsDataURL(inputFile);
      }
    }
  };
  
  // Display the avatar editing button.
  showAvatarEditor = () => {
      const avatarButton = document.getElementById("change-avatar-pre");
      avatarButton.style.opacity = 0.6;
  };
  // Hide the avatar editing button.
  hideAvatarEditor = () => {
      const avatarButton = document.getElementById("change-avatar-pre");
      avatarButton.style.opacity = 0;
  };
  
  changeAvatarPre = () => { document.getElementById("change-avatar").click(); }
  // this funtion gets the temp url of the uploaded img
  // TODO: change the following code in phase 2, so that we keep the file
  changeAvatar = (event) => {
    const inputFile = event.target.files[0]

    if (inputFile != null) {
      const isJPG = inputFile.type === 'image/jpeg';
      const isPNG = inputFile.type === 'image/png';

      if (!isJPG && !isPNG) {
        inputFile.status = 'error';
        console.log("You can only upload png or jpg files.");
      } else {
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({avatar: imgReader.result});
          // save the new banner to mock data, change in phase 2
          this.props.state.current_user.avatar = imgReader.result;
        })
        imgReader.readAsDataURL(inputFile);
      }
    }
  };

  render() {
    if (!this.props.state.current_user) {
      return <Redirect to="/" />;
    }
    return (
      <div className="user-profile-page">
        <div>
          {this.state.showPop ? (
            <Popup
              header="This is not BUG, It's feature ^v^"
              closePopup={this.closePopup.bind(this)}
            />
          ) : (
            <img className="bannerPic" 
                src={this.state.banner} 
                alt="Banner" 
                onMouseOver={() => {this.showBannerEditor(); this.hideAvatarEditor();}}
                onMouseOut={this.hideBannerEditor}/>
          )}
          <div id="banner-button-container" hidden="hidden">
            <button className="btn btn-warning" 
                onClick={this.changeBannerPre} 
                onMouseOver={this.showBannerEditor}>
                Change Banner
            </button>
          </div>
          <input type="file" 
            id="change-banner" 
            hidden="hidden" 
            onChange={this.changeBanner}/>
        </div>

        <div id="profileStats">
          <ul className="text-center">
            <li>
              Posts
              <br />
              <span className="profileStatsNumber">{this.state.numPosts}</span>
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
                  <h2>Name: {this.state.nickname}</h2>
                  <p>Motto: {this.state.motto}</p>
                  <p>{this.state.description}</p>
                  <Link to="/prof_setting" id="profile-setting-btn">
                    <button className="btn btn-light btn-block">
                      Profile Setting
                    </button>
                  </Link>
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
          <div id="profileImgContainer">
            <img
              id="bigProfilePicCircle"
              src={this.state.avatar}
              alt="ProfilePicture"
              onClick={this.handlePopup.bind(this)}
              onMouseOver={this.showAvatarEditor}
              onMouseOut={this.hideAvatarEditor}
            />
            <button id="change-avatar-pre"
                onClick={this.changeAvatarPre}
                onMouseOver={this.showAvatarEditor}>
                <h5>Change Avatar</h5>
            </button>
            <input type="file" 
                id="change-avatar" 
                hidden="hidden" 
                onChange={this.changeAvatar}/>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
