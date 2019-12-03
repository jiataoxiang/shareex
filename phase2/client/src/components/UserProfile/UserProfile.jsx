import React from 'react';
import '../../stylesheets/user_profile.scss';
import { Link, withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';
import MessageBoard from './MessageBoard';
import PostsBoard from './PostsBoard';
import store from '../../store';
import { loadUser } from '../../actions/authActions';
import Animation from './Animation.jsx';
import FavoritesBoard from './FavoritesBoard';
import ViewHistoryboard from './ViewHistoryBoard';
import FollowerBoard from './FollowerBoard';
import NotificationBoard from './NotificationBoard';

class UserProfile extends React.Component {
  state = {
    posts: [],
    showPop: false,
    followers: [],
    messages: [],
    alert: null,
    following: [],
    curState: '',
    author: '',
    msg: { readMsg: [], unreadMsg: [] },
  };

  handlePopup = () => {
    // Show the pop up window.
    this.setState({
      showPop: !this.state.showPop,
    });
  };

  getNumPosts = currentUser => {
    axios
      .get(`/api/posts/user-posts/${currentUser._id.toString()}`, this.props.tokenConfig())
      .then(posts => {
        this.setState({
          numPosts: posts.data.length,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  updatePosts = () => {
    axios
      .get('/api/posts/by-user/' + this.props.current_user._id, this.props.tokenConfig())
      .then(res => {
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error);
      });
  };
  setFunctions = () => {
    if (this.state.curState === '') {
      this.setState({
        curState: <PostsBoard author={this.props.current_user._id} />,
      });
    }
  };

  showOption = option => {
    if (option === 'Message Board') {
      this.setState({ curState: <MessageBoard author={this.props.current_user._id} /> });
    } else if (option === 'Posts') {
      this.setState({ curState: <PostsBoard author={this.props.current_user._id} /> });
    } else if (option === 'Favorites') {
      this.setState({
        curState: (
          <FavoritesBoard
            author={this.props.current_user._id}
            posts={this.props.current_user.favs}
          />
        ),
      });
    } else if (option === 'View History') {
      this.setState({
        curState: (
          <ViewHistoryboard
            author={this.props.current_user._id}
            posts={this.props.current_user.view_history}
          />
        ),
      });
    } else if (option === 'Follower Board') {
      this.setState({
        curState: <FollowerBoard author={this.props.current_user._id} />,
      });
    } else if (option === 'Notifications') {
      this.readNotifications();
      this.hideBadge();
      this.setState({
        curState: <NotificationBoard author={this.props.current_user._id} />,
      });
    }
  };

  hideBadge = () => {
    const msg_badge = document.getElementById('unread-notifications');
    msg_badge.setAttribute('hidden', true);
  };

  showBadge = () => {
    const msg_badge = document.getElementById('unread-notifications');
    msg_badge.removeAttribute('hidden');
  };

  getNotifications = () => {
    this.hideBadge();

    axios
      .get(`/api/notifications/receiver/${this.props.current_user._id}`, this.props.tokenConfig())
      .then(msgs => {
        msgs.data.forEach(msg => {
          if (msg.read) {
            this.state.msg.readMsg.push(msg);
          } else {
            this.showBadge();
            this.state.msg.unreadMsg.push(msg);
          }
        });
        this.setState({
          msg: this.state.msg,
        });
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
        nickname: currentUser.username,
        banner: currentUser.banner,
        avatar: currentUser.avatar,
        followers: currentUser.followers,
        following: currentUser.following,
        motto: currentUser.motto,
      });
      this.getNumPosts(currentUser);
      this.updatePosts();
      this.setFunctions();
      this.getNotifications();
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
    this.uploadImage('banner', inputFile);
  };

  uploadImage = (type, inputFile) => {
    if (inputFile != null) {
      // const isJPG = inputFile.type === 'image/jpeg';
      // const isPNG = inputFile.type === 'image/png';
      const is_valid_image = ['image/jpeg', 'image/png', 'image/jpg'].includes(inputFile.type);

      if (!is_valid_image) {
        inputFile.status = 'error';
        console.log('You can only upload png or jpg files.');
      }
      const formData = new FormData();
      formData.append('file', inputFile); // get first file chosen
      formData.append('public_id', `${type}_${this.props.current_user._id}`);
      this.setState({ alert: `Uploading ${type}` });
      axios
        .post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          const url = res.data[0].url;
          axios
            .patch(
              `/api/users/${this.props.current_user._id}`,
              { [type]: url },
              this.props.tokenConfig(),
            )
            .then(res => {
              store.dispatch(loadUser());
              this.setState({ [type]: url });
              this.setState({ alert: 'Image Modified' });
              setTimeout(() => {
                this.setState({ alert: null });
              }, 2000);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
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
    this.uploadImage('avatar', inputFile);
  };

  readNotifications = () => {
    axios
      .post(`/api/notifications/read/${this.props.current_user._id}`, {}, this.props.tokenConfig())
      .then(result => {
        if (!result) {
          console.log('Notifications count not be read.');
        } else {
          console.log(result.data.nModified + ' new notifications read.');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (!this.props.isAuthenticated) {
      window.location.href = '/';
    }
    const options = ['Message Board', 'Posts', 'Favorites', 'View History', 'Follower Board'];
    return (
      <div className="user-profile-page">
        {this.state.alert ? (
          <div className="alert alert-primary" role="alert">
            {this.state.alert}
          </div>
        ) : null}
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
          <input type="file" id="change-banner" hidden="hidden" onChange={this.changeBanner} />
        </div>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-4">
              {/* <div className="space"></div> */}
              <div className="profileInfo card">
                <div className="card-header">
                  <h2>Name: {this.state.nickname}</h2>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Motto:</strong> {this.state.motto}
                  </p>
                  <p>
                    <strong>Posts:</strong> {this.state.numPosts}
                  </p>
                  <p>
                    <strong>Followers:</strong> {this.state.followers.length}
                  </p>
                  <p>
                    <strong>Following:</strong> {this.state.following.length}
                  </p>
                  <Link to="/prof_setting" id="profile-setting-btn">
                    <button className="btn btn-light btn-block">Profile Setting</button>
                  </Link>
                </div>
              </div>
              <h2>Options</h2>
              <div className="list-group options">
                {options.map(option => {
                  return (
                    <button
                      key={uid(Math.random())}
                      className="list-group-item list-group-item-action"
                      onClick={this.showOption.bind(this, option)}
                    >
                      {option}
                    </button>
                  );
                })}
                <button
                  type="button"
                  id="button-4"
                  className="list-group-item list-group-item-action"
                  onClick={this.showOption.bind(this, 'Notifications')}
                >
                  Notification
                  <span id="unread-notifications" className="badge badge-danger">
                    New
                  </span>
                </button>
              </div>
            </div>
            <div className="col-lg-8">{this.state.curState}</div>
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
            <input type="file" id="change-avatar" hidden="hidden" onChange={this.changeAvatar} />
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
        'Content-type': 'application/json',
      },
    };
    // If token, add to headers
    if (state.auth.token) {
      config.headers['x-auth-token'] = state.auth.token;
    }
    return config;
  },
});

export default connect(mapStateToProps)(withRouter(UserProfile));
