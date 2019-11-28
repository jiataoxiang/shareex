import React from "react";
import "../../stylesheets/user_profile.scss";
import { withRouter} from "react-router-dom";
import Post from "../Post";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";
import axios from "axios"
import { connect } from 'react-redux';
import MessageBoard from "./MessageBoard";

class OtherProfile extends React.Component {

  state = {
    post_id: this.props.location.state.post_id,
    author: this.props.location.state.author,
    nickname: "",
    banner: "",
    avatar: "",
    followers: [],
    following: [],
    messages: [],
    likes: [],
    numPosts: -1,
    motto: "",
    current_message: "",
    posts : []
  };

  updatePosts = () => {
    console.log('updating posts');
    axios
      .get(
        '/api/posts/by-user/' + this.state.author,
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

  sendMessage = () => {
    const message = document.getElementById("message").value;
    const current_user_id = this.props.current_user._id;
    console.log(this.state.author);

    axios.post(`/api/users/add-messenger/${this.state.author}`,
      {
        "messenger_id": current_user_id,
        "content": message
      },
      this.props.tokenConfig())
      .then((user) => {
        console.log(user)
      })
      .catch((error) => {
        console.log(error)
      });

    this.getUserInfo()
  };

  componentDidMount() {
    this.getUserInfo();
    this.getNumPosts(this.state.author);
    this.updatePosts();
  }


  getNumPosts = (currentUser) => {
    console.log("the current usr is : " + currentUser);
    axios.get(`/api/posts/user-posts/${currentUser}`,  this.props.tokenConfig())
      .then(posts => {
        this.setState({
          numPosts: posts.data.length
        })
      }).catch((error) => {
      console.log(error)
    });
  };

  getUserInfo = ()=>{
    axios.get(`/api/users/${this.state.author}`, this.props.tokenConfig())
      .then((user) => {
        user = user.data;
        console.log(user);
        this.setState({
          nickname: user.nickname,
          banner: user.banner,
          avatar: user.avatar,
          followers: user.followers,
          following: user.following,
          likes: user.likes.length,
          motto: user.motto,
          messages: user.messages
        })
      })
  };

  isUnfollowing = () => {
    // console.log(this.state.followers);
    return this.state.followers.filter(follower => follower === this.props.current_user._id).length === 0
  };

  unFollowRequest = () => {
    //remove following in current user
    axios.post(`/api/users/remove-following/${this.props.current_user._id}`,
      {"following_id": this.state.author},
      this.props.tokenConfig())
      .then((following) => {
        // this.setState({
        //   following: following.data.following
        // })
        console.log(following)
      }).catch((error) => {
        console.log(error)
    });

    //remove follower in current user
    axios.post(`/api/users/remove-follower/${this.state.author}`,
      {"follower_id": this.props.current_user._id},
      this.props.tokenConfig())
      .then((followers) => {
        this.setState({
          followers: followers.data.followers
        })
      }).catch((error) => {
        console.log(error)
    })
  };

  followRequest = ()=>{
    //add following in current user
    axios.post(`/api/users/add-following/${this.props.current_user._id}`,
      {"following_id": this.state.author},
      this.props.tokenConfig())
      .then((following) => {
        // this.setState({
        //   following: following.data.following
        // });
      console.log(following)
    }).catch((error) => {
      console.log(error);
    });
    //add follower in post user
    axios.post(`/api/users/add-follower/${this.state.author}`,
      {"follower_id": this.props.current_user._id},
      this.props.tokenConfig())
      .then((followers) => {
        this.setState({
          followers: followers.data.followers
        });
        console.log(followers)
      }).catch((error) => {
        console.log(error)
    });
  };

  render() {
    if(!this.props.isAuthenticated){
      window.location.href = "/"
    }
    return (
      <div className="user-profile-page">
        <img
          className="bannerPic"
          src={this.state.banner}
          alt="Banner"
        />
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
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="sticky-top">
                <div className="space"></div>
                <div id="profileInfo">
                  <h2>Name: {this.state.nickname}</h2>
                  <p>Motto: {this.state.motto}</p>
                  <p>{this.state.description}</p>
                  {this.isUnfollowing() ?
                    <button className="btn btn-success btn-block" onClick={this.followRequest}>
                      <strong>Follow</strong>
                    </button>:
                    <button className="btn btn-danger btn-block" onClick={this.unFollowRequest}>
                      <strong>Unfollow</strong>
                    </button>
                  }

                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="my-3 p-3 rounded box-shadow overflow-auto fix-length ">
                <h6>Recent updates</h6>
                {this.state.messages.map(message => {
                  return <MessageBoard key={uid(Math.random())} message={message}/>
                })}
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <button className="input-group-text" onClick={this.sendMessage.bind(this)}>
                    Send
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="message"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  name="message"
                />
              </div>
              <div className="timeline">
                <h3 className="timelineheader">Posts</h3>
                {this.state.posts.map(post => {
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
    return config
  }
});

export default connect(mapStateToProps)(withRouter(OtherProfile));
