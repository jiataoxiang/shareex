import React from 'react';
import '../../stylesheets/user_profile.scss';
import Post from '../Post';
import { rand_string } from '../../lib/util';
import { Link, withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import Popup from './Popup';
import { connect } from 'react-redux';
import axios from 'axios';
// import {tokenConfig} from "../../actions/authActions";

class UserProfile extends React.Component {
  state = {
    posts: [],
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

  componentDidMount() {
    // Current user info
    const currentUser = this.props.current_user;
    if (currentUser) {
      this.setState({
        nickname: currentUser.nickname,
        banner: currentUser.banner,
        avatar: currentUser.avatar,
        followers: currentUser.followers.length,
        following: currentUser.following.length,
        likes: currentUser.likes.length,
        motto: currentUser.motto
      });
      this.updatePosts();
    }
  }

  // getPosts = () => {
  //   // TODO: connect to server, get posts from server.
  //   // find all posts belonging to current user
  //   const posts_display = [];
  //   if (this.props.state.posts) {
  //     const posts = this.props.state.posts.filter(
  //       post => post.author_id === this.props.state.current_user.id
  //     );
  //
  //     if (posts) {
  //       console.log(posts);
  //       for (let i = 0; i < posts.length; i++) {
  //         // find all attachments
  //         const attachments = this.props.state.attachments.filter(
  //           attachment => attachment.post_id === posts[i].id
  //         );
  //         posts_display.push(
  //           <Post
  //             key={uid(rand_string())}
  //             post={posts[i]}
  //             posts={posts}
  //             users={this.props.state.users}
  //             attachments={attachments}
  //             current_user={this.props.state.current_user}
  //             setAppState={this.props.state.setAppState}
  //           />
  //         );
  //       }
  //     }
  //   }
  //   return posts_display;
  // };

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
    const posts = this.state.posts;
    return (
      <div className="user-profile-page">
        <div>
          {this.state.showPop ? (
            <Popup
              header="This is not BUG, It's feature ^v^"
              closePopup={this.closePopup.bind(this)}
            />
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
              <span className="profileStatsNumber">{this.state.followers}</span>
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
                {posts.map(post => {
                  return <Post key={uid(Math.random())} post={post} />;
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
