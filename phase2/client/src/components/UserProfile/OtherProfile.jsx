import React from 'react';
import '../../stylesheets/user_profile.scss';
import { withRouter } from 'react-router-dom';
import MessageBoard from './MessageBoard';
import PostsBoard from './PostsBoard';
import { uid } from 'react-uid';
import axios from 'axios';
import { connect } from 'react-redux';

class OtherProfile extends React.Component {
  state = {
    post_id: this.props.location.state.post_id,
    author: this.props.location.state.author,
    curState: '',
    nickname: '',
    banner: '',
    avatar: '',
    followers: [],
    following: [],
    messages: [],
    likes: [],
    numPosts: -1,
    motto: '',
    current_message: '',
    posts: [],
    functions: [],
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
    console.log('updating posts');
    axios
      .get('/api/posts/by-user/' + this.state.author, this.props.tokenConfig())
      .then(res => {
        console.log(res.data);
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getUserInfo();
    this.getNumPosts(this.state.author);
    this.updatePosts();
    this.setFunctions();
  }

  getNumPosts = currentUser => {
    console.log('the current usr is : ' + currentUser);
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
    axios.get(`/api/users/${this.state.author}`, this.props.tokenConfig()).then(user => {
      user = user.data;
      console.log(user);
      this.setState({
        nickname: user.username,
        banner: user.banner,
        avatar: user.avatar,
        followers: user.followers,
        following: user.following,
        likes: user.likes.length,
        motto: user.motto,
        messages: user.messages,
      });
    });
  };

  isUnfollowing = () => {
    // console.log(this.state.followers);
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
      .then(following => {
        console.log(following);
      })
      .catch(error => {
        console.log(error);
      });

    //remove follow in current user
    console.log("author is "+this.state.author);
    console.log("cur user is "+this.props.current_user._id);
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
  };

  followRequest = () => {
    //add following in current user
    axios
      .post(
        `/api/users/add-following/${this.props.current_user._id}`,
        { following_id: this.state.author },
        this.props.tokenConfig(),
      )
      .then(following => {
        console.log(following);
      })
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
        console.log(followers);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (!this.props.isAuthenticated) {
      window.location.href = '/';
    }
    return (
      <div className="user-profile-page">
        <img className="bannerPic" src={this.state.banner} alt="Banner" />
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
              <span className="profileStatsNumber">{this.state.followers.length}</span>
            </li>
            <li>
              Following
              <br />
              <span className="profileStatsNumber">{this.state.following.length}</span>
            </li>
            <li>
              Likes
              <br />
              <span className="profileStatsNumber">{this.state.likes}</span>
            </li>
          </ul>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <div className="sticky-top">
                <div className="space"></div>
                <div id="profileInfo">
                  <h2>Name: {this.state.nickname}</h2>
                  <p>Motto: {this.state.motto}</p>
                  <p>{this.state.description}</p>
                  {this.isUnfollowing() ? (
                    <button className="btn btn-success btn-block" onClick={this.followRequest}>
                      <strong>Follow</strong>
                    </button>
                  ) : (
                    <button className="btn btn-danger btn-block" onClick={this.unFollowRequest}>
                      <strong>Unfollow</strong>
                    </button>
                  )}
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
                <br />
              </div>
            </div>
            <div className="col-md-8">{this.state.curState}</div>
          </div>
          <div id="profileImgContainer">
            <img id="bigProfilePicCircle" src={this.state.avatar} alt="ProfilePicture" />
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
