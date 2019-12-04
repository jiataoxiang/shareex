import React from 'react';
import '../../stylesheets/user_profile.scss';
import { withRouter } from 'react-router-dom';
import MessageBoard from './MessageBoard';
import PostsBoard from './PostsBoard';
import { uid } from 'react-uid';
import axios from 'axios';
import { connect } from 'react-redux';
import store from '../../store';
import { loadUser } from '../../actions/authActions';

class OtherProfile extends React.Component {
  state = {
    author: '',
    curState: '',
    nickname: '',
    banner: '',
    avatar: '',
    followers: [],
    following: [],
    messages: [],
    numPosts: -1,
    motto: '',
    current_message: '',
    posts: [],
    functions: [],
    email: ''
  };

  showComponent = component => {
    this.setState({
      curState: component,
    });
  };

  setFunctions = () => {
    if (this.state.curState === '') {
      this.setState({
        curState: <PostsBoard author={this.state.author} />,
      });
    }
    this.setState({
      functions: [
        {
          id: 1,
          title: 'message_board',
          model: <MessageBoard author={this.state.author} />,
        },
        {
          id: 2,
          title: 'posts',
          model: <PostsBoard author={this.state.author} />,
        },
      ],
    });
  };

  updatePosts = () => {
    axios
      .get('/api/posts/by-user/' + this.state.author, this.props.tokenConfig())
      .then(res => {
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getUserInfo();
  }

  getNumPosts = currentUser => {
    axios
      .get(`/api/posts/user-posts/${currentUser}`, this.props.tokenConfig())
      .then(posts => {
        this.setState({
          numPosts: posts.data.length,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getUserInfo = () => {
    this.setState({
      author: this.props.match.params.id,
    });
    axios
      .get(`/api/users/${this.props.match.params.id}`, this.props.tokenConfig())
      .then(user => {
        if (!user) {
          window.location.href = '/';
        } else {
          user = user.data;
          this.setState({
            nickname: user.username,
            banner: user.banner,
            avatar: user.avatar,
            followers: user.followers,
            following: user.following,
            motto: user.motto,
            messages: user.messages,
            email: user.email
          });
          this.getNumPosts(this.state.author);
          this.updatePosts();
          this.setFunctions();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  isUnfollowing = () => {
    return (
      this.state.followers.filter(follower => follower === this.props.current_user._id).length === 0
    );
  };

  unFollowRequest = () => {
    //remove following in current user
    axios
      .post(
        `/api/users/remove-following/${this.props.current_user._id}`,
        { following_id: this.state.author },
        this.props.tokenConfig(),
      )
      .then(following => {})
      .catch(error => {
        console.log(error);
      });

    //remove follow in current user
    axios
      .post(
        `/api/users/remove-follower/${this.state.author}`,
        { follower_id: this.props.current_user._id },
        this.props.tokenConfig(),
      )
      .then(followers => {
        this.setState({
          followers: followers.data.followers,
        });
      })
      .catch(error => {
        console.log(error);
      });
    store.dispatch(loadUser());
  };

  followRequest = () => {
    //add following in current user
    axios
      .post(
        `/api/users/add-following/${this.props.current_user._id}`,
        { following_id: this.state.author },
        this.props.tokenConfig(),
      )
      .then(() => {})
      .catch(error => {
        console.log(error);
      });
    //add follow in post user
    axios
      .post(
        `/api/users/add-follower/${this.state.author}`,
        { follower_id: this.props.current_user._id },
        this.props.tokenConfig(),
      )
      .then(followers => {
        this.setState({
          followers: followers.data.followers,
        });
      })
      .catch(error => {
        console.log(error);
      });
    store.dispatch(loadUser());
  };

  sendMsg = e => {
    e.preventDefault();
    const message = document.getElementById('message-input').value;
    if (!message) {
      alert("Report failed because you didn't fill in the reason!");
    } else {
      this.sendMsgToServer(message, 'Message sent.', 'Message failed to send.');
    }
  };

  sendMsgToServer = (msgBody, success, fail) => {
    const newMsg = {
      from: this.props.current_user._id,
      body:
        `User "${this.state.nickname}" is reported by user "${this.props.current_user.username}", reason is : ` +
        msgBody,
      link: `/otherprofile/${this.state.author}`,
    };

    axios
      .post(`/api/notifications/to-admin`, newMsg, this.props.tokenConfig())
      .then(msg => {
        if (!msg) {
          alert(fail);
        } else {
          alert(success);
        }
      })
      .catch(err => {
        alert(fail);
        console.log(err);
      });
  };

  render() {
    if (!this.props.isAuthenticated) {
      window.location.href = '/';
    }
    return (
      <div className="user-profile-page other-profile-page">
        <img className="bannerPic" src={this.state.banner} alt="Banner" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <div className="profileInfo card">
                <div className="card-header">
                  <h2>Name: {this.state.nickname}</h2>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Motto:</strong> {this.state.motto}
                  </p>
                  <p>
                    <strong>Email:</strong> {this.state.email}
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
                </div>
                {this.props.current_user.admin ? null : this.isUnfollowing() ? (
                  <button className="btn btn-success btn-block" onClick={this.followRequest}>
                    <strong>Follow</strong>
                  </button>
                ) : (
                  <button className="btn btn-danger btn-block" onClick={this.unFollowRequest}>
                    <strong>Unfollow</strong>
                  </button>
                )}
                {this.props.current_user.admin ? null : (
                  <div>
                    <button
                      data-toggle="modal"
                      data-target="#myModal"
                      className="btn btn-warning btn-block"
                      onClick={this.showModal}
                    >
                      <strong>Report</strong>
                    </button>
                    <div
                      id="myModal"
                      className="modal fade bd-example-modal-lg"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="myLargeModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h2 className="title-color">{`Report user ${this.state.nickname}`}</h2>
                          </div>
                          <div className="modal-body">
                            <div className="form-group">
                              <label htmlFor="message-input" className="title-color col-form-label">
                                Reason:
                              </label>
                              <input
                                type="text"
                                id="message-input"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default"
                                name="title"
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                id="button-delete"
                                className="btn btn-primary btn-danger btn-block"
                                data-dismiss="modal"
                                onClick={this.sendMsg}
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h2 id="option">Options</h2>
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
              <br />
            </div>
            <div className="col-md-8 other-profile-content">{this.state.curState}</div>
          </div>
          <div id="otherProfileImgContainer">
            <img id="otherProfilePicCircle" src={this.state.avatar} alt="ProfilePicture" />
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

export default connect(mapStateToProps)(withRouter(OtherProfile));
