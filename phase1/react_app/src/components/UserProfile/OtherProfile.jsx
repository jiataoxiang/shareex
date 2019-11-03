import React from "react";
import "../../stylesheets/user_profile.scss";
import { withRouter} from "react-router-dom";
import Post from "../Post";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";

class OtherProfile extends React.Component {

  state = {
    nickname: "",
    banner: "",
    avatar: "",
    follower: -1,
    following: -1,
    likes: -1,
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

  componentDidMount() {
    this.loadUserFromServer();
  } 

  // The code below are temporary code for randomly generating some post content and recommendations
  // TODO: replace the following initialization code in phase 2, connect to server and get real data
  // Current user info
  loadUserFromServer() {
    const users = this.props.state.users;
    const posts = this.props.state.posts;
    if (posts) {
      const post = posts.filter(post => post.id === this.state.post_id)[0];
      const currentUser = users.filter(user => user.id === post.author_id)[0];
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
  }

  getPosts = () => {
    // find all posts belonging to current user
    const users = this.props.state.users;
    const posts = this.props.state.posts;
    if (posts) {
      const post = posts.filter(post => post.id === this.state.post_id)[0];
      const current_user = users.filter(user => user.id === post.author_id)[0];
      const posts_display = [];
      if (this.props.state.posts) {
        const posts = this.props.state.posts.filter(
          post => post.author_id === current_user.id
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
    }else {
      return [];
    }
  };

  render() {

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
                  <button className="btn btn-success btn-block">
                    <strong>Follow</strong>
                  </button>
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
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(OtherProfile);
