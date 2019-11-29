import React from 'react';
import '../../stylesheets/user_profile.scss';
import { Link, withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';
import Follower from "./Follower";
import MessageBoard from "./MessageBoard";
import PostsBoard from "./PostsBoard";
import Animation from './Animation.jsx';

class UserProfile extends React.Component {
  state = {
    posts: [],
    showPop: false,
    followers: [],
    messages: [],
    following: [],
    curState: "",
    author: "",
    functions: []
  };

  showComponent = component => {
    this.setState({
      curState: component
    });
  };

  handlePopup = () => {
    // Show the pop up window.
    this.setState({
      showPop: !this.state.showPop
    });
  };

  getNumPosts = currentUser => {
    axios
      .get(
        `/api/posts/user-posts/${currentUser._id.toString()}`,
        this.props.tokenConfig()
      )
      .then(posts => {
        this.setState({
          numPosts: posts.data.length
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  updatePosts = () => {
    console.log('updating posts');
    axios
      .get(
        '/api/posts/by-user/' + this.props.current_user._id,
        this.props.tokenConfig()
      )
      .then(res => {
        console.log(res.data);
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error);
      });
  };
  setFunctions = () => {
    if (this.state.curState === ""){
      this.setState({
        curState: <PostsBoard author={this.props.current_user._id}/>
      })
    }
    this.setState({
      functions: [
        {
          id: 1,
          title: "message_board",
          model: <MessageBoard author={this.props.current_user._id}/>
        }, {
          id: 2,
          title: "posts",
          model: <PostsBoard author={this.props.current_user._id}/>
        }
      ]
    })
  };

  componentDidMount() {
    // Current user info
    const currentUser = this.props.current_user;
    if (currentUser) {
      this.setState({
        nickname: currentUser.username,
        banner: currentUser.banner,
        avatar: currentUser.avatar,
        followers: currentUser.followers,
        following: currentUser.following,
        likes: currentUser.likes.length,
        motto: currentUser.motto,
      });
      this.getNumPosts(currentUser);
      this.updatePosts();
      this.setFunctions();
    }
  }

  // Display the banner editing button.
  showBannerEditor = () => {
    const bannerButton = document.getElementById('banner-button-container');
    bannerButton.removeAttribute('hidden');
    bannerButton.classList.add('buttonDrop');
  };
  // Hide the banner editing button.
  hideBannerEditor = () => {
    const bannerButton = document.getElementById('banner-button-container');
    bannerButton.setAttribute('hidden', true);
    bannerButton.classList.remove('buttonDrop');
  };

  changeBannerPre = () => {
    document.getElementById('change-banner').click();
  };
  // this function gets the temp url of the uploaded img
  // TODO: change the following code in phase 2, so that we keep the file
  changeBanner = event => {
    const inputFile = event.target.files[0];

    if (inputFile != null) {
      const isJPG = inputFile.type === 'image/jpeg';
      const isPNG = inputFile.type === 'image/png';

      if (!isJPG && !isPNG) {
        inputFile.status = 'error';
        console.log('You can only upload png or jpg files.');
      } else {
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({ banner: imgReader.result });
          // save the new banner to mock data, change in phase 2
          this.props.state.current_user.banner = imgReader.result;
        });
        imgReader.readAsDataURL(inputFile);
      }
    }
  };

  // Display the avatar editing button.
  showAvatarEditor = () => {
    const avatarButton = document.getElementById('change-avatar-pre');
    avatarButton.style.opacity = 0.6;
  };
  // Hide the avatar editing button.
  hideAvatarEditor = () => {
    const avatarButton = document.getElementById('change-avatar-pre');
    avatarButton.style.opacity = 0;
  };

  changeAvatarPre = () => {
    document.getElementById('change-avatar').click();
  };
  // this funtion gets the temp url of the uploaded img
  // TODO: change the following code in phase 2, so that we keep the file
  changeAvatar = event => {
    const inputFile = event.target.files[0];

    if (inputFile != null) {
      const isJPG = inputFile.type === 'image/jpeg';
      const isPNG = inputFile.type === 'image/png';

      if (!isJPG && !isPNG) {
        inputFile.status = 'error';
        console.log('You can only upload png or jpg files.');
      } else {
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({ avatar: imgReader.result });
          // save the new banner to mock data, change in phase 2
          this.props.state.current_user.avatar = imgReader.result;
        });
        imgReader.readAsDataURL(inputFile);
      }
    }
  };

  render() {
    if (!this.props.isAuthenticated) {
      window.location.href = '/';
    }
    const followers = this.state.followers;
    return (
      <div className="user-profile-page">
        <div>
          {this.state.showPop ? (
            <div className="popupWindow">
              <Animation />
            </div>
          ) : (
            <img
              className="bannerPic"
              src={this.state.banner}
              alt="Banner"
              onMouseOver={() => {
                this.showBannerEditor();
                this.hideAvatarEditor();
              }}
              onMouseOut={this.hideBannerEditor}
            />
          )}
          <div id="banner-button-container" hidden="hidden">
            <button
              className="btn btn-warning"
              onClick={this.changeBannerPre}
              onMouseOver={this.showBannerEditor}
            >
              Change Banner
            </button>
          </div>
          <input
            type="file"
            id="change-banner"
            hidden="hidden"
            onChange={this.changeBanner}
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-4">
                <div className="space"></div>
                <div className="profileInfo">
                  <h2>Name: {this.state.nickname}</h2>
                  <p>Motto: {this.state.motto}</p>
                  <p>Posts: {this.state.numPosts}</p>
                  <p>Followers: {this.state.followers.length}</p>
                  <p>Following: {this.state.following.length}</p>
                  <p>Likes: {this.state.likes}</p>
                  <Link to="/prof_setting" id="profile-setting-btn">
                    <button className="btn btn-light btn-block">
                      Profile Setting
                    </button>
                  </Link>
                </div>
                <h2>Options</h2>
                <div className="list-group options">
                  {this.state.functions.map(fun => (
                    <button
                      key={uid(Math.random())}
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={this.showComponent.bind(this, fun.model)}
                    >
                      {fun.title}
                    </button>
                  ))}
                </div>
              <br/>
              <div className="followers">
                <h3> Followers</h3>
                {followers.map((follower)=>{
                  return <Follower key={uid(Math.random())} follower = {follower}/>
                })}
              </div>
            </div>
            <div className="col-md-8 content-display">
              {this.state.curState}
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
            <button
              id="change-avatar-pre"
              onClick={this.changeAvatarPre}
              onMouseOver={this.showAvatarEditor}
            >
              <h5>Change Avatar</h5>
            </button>
            <input
              type="file"
              id="change-avatar"
              hidden="hidden"
              onChange={this.changeAvatar}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  tokenConfig: () => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };
    // If token, add to headers
    if (state.auth.token) {
      config.headers['x-auth-token'] = state.auth.token;
    }
    return config;
  }
});

export default connect(mapStateToProps)(withRouter(UserProfile));
