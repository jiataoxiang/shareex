import React from "react";
import "../../stylesheets/user_profile.scss";
import { withRouter} from "react-router-dom";
import Post from "../Post";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";
import axios from "axios"
import { connect } from 'react-redux';

class OtherProfile extends React.Component {

  // TODO: NEED TO BE TESTED AFTER SINGLE POST FINISH.
  // TODO: connect to server, get information
  state = {
    nickname: "",
    banner: "",
    avatar: "",
    followers: [],
    following: [],
    likes: [],
    numPosts: -1,
    motto: "",
    
    post_id: ""
  };  
    
  constructor(props) {
    super(props);
    if (this.props.location.state) {
      this.state = {
        post_id: this.props.location.state.post_id
      };
    }else {
      /* if other profile is accessed by typing URL instead of clicking a link
        post_id is not available, we don't know which post to render, thus
        redirect to home page
      */
      this.props.history.push("/");
    }
  }
  componentWillMount() {
    axios.get(`/api/posts/${this.state.post_id}`, this.props.tokenConfig())
      .then((post) => {
        this.setState({
          post: post.data,
          author: post.data.author
        })
      });
  }

  componentDidMount() {
    this.loadUserFromServer();
  }

  getNumPosts = (currentUser) => {
    axios.get(`/api/posts/user-posts/${currentUser._id.toString()}`,  this.props.tokenConfig())
      .then(posts => {
        this.setState({
          numPosts: posts.data.length
        })
      }).catch((error) => {
      console.log(error)
    })
  };

  getUserInfo = ()=>{
    axios.get(`/api/users/${this.props.post.author}`, this.props.tokenConfig())
      .then((user) => {
        user = user.data;
        this.setState({
          nickname: user.nickname,
          banner: user.banner,
          avatar: user.avatar,
          followers: user.followers,
          following: user.following,
          likes: user.likes.length,
          motto: user.motto
        })
      })
  };

  isFollowing = () => {
    return this.state.following.filter(following => following.equals(this.state.author)).length !== 0
  };

  unFollowRequest = () => {
    //remove following in current user
    axios.post(`/api/add-following/${this.props.current_user._id}`,
      {"following_id": this.props.author},
      this.props.tokenConfig())
      .then((following) => {
        this.setState({
          following: following.data.following
        })
      }).catch((error) => {
        console.log(error)
    });

    //remove follower in current user
    axios.post(`/api/add-follower/${this.props.author}`,
      {followers: this.props.current_user._id},
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
    axios.post(`/api/add-following/${this.props.current_user._id}`,
      {"following_id": this.props.author},
      this.props.tokenConfig())
      .then((following) => {
        this.setState({
          following: following.data.following
        });
      console.log(following)
    }).catch((error) => {
      console.log(error);
    });
    //add follower in post user
    axios.post(`/api/add-follower/${this.props.author}`,
      {"followed_id": this.props.current_user._id},
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

  loadUserFromServer() {
    // Loading user from our fake data
    // TODO: replace the following initialization code in phase 2, connect to server and get real data
    // Current user info
    this.getUserInfo();
    this.getNumPosts(this.props.author);
  }

  // getPosts = () => {
  //   // TODO: connect to server, get posts from server
  //   // find all posts belonging to current user
  //   const users = this.props.state.users;
  //   const posts = this.props.state.posts;
  //   if (posts) {
  //     const post = posts.filter(post => post.id === this.state.post_id)[0];
  //     const current_user = users.filter(user => user.id === post.author_id)[0];
  //     const posts_display = [];
  //     if (this.props.state.posts) {
  //       const posts = this.props.state.posts.filter(
  //         post => post.author_id === current_user.id
  //       );
  //
  //       if (posts) {
  //         console.log(posts);
  //         for (let i = 0; i < posts.length; i++) {
  //           // find all attachments
  //           const attachments = this.props.state.attachments.filter(
  //             attachment => attachment.post_id === posts[i].id
  //           );
  //           posts_display.push(
  //             <Post
  //               key={uid(rand_string())}
  //               post={posts[i]}
  //               posts={posts}
  //               users={this.props.state.users}
  //               attachments={attachments}
  //               current_user={this.props.state.current_user}
  //               setAppState={this.props.state.setAppState}
  //             />
  //           );
  //         }
  //       }
  //     }
  //     return posts_display;
  //   }else {
  //     return [];
  //   }
  // };

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
                  {this.isFollowing() ?
                    <button className="btn btn-success btn-block" onClick={this.followRequest}>
                      <strong>Follow</strong>
                    </button>:
                    <button className="btn btn-success btn-block" onClick={this.unFollowRequest}>
                      <strong>Unfollow</strong>
                    </button>
                  }

                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="timeline">
                <h3 className="timelineheader">Posts</h3>
                {/*{this.getPosts().map(post => {*/}
                {/*  return post;*/}
                {/*})}*/}
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
