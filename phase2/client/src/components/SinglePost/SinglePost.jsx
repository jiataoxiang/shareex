import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "../../stylesheets/single_post.scss";
import Comment from "../Comment";
import Attachment from "../Attachment";
import {connect} from 'react-redux';
import {rand_string} from "../../lib/util";
import {uid} from "react-uid";
import axios from "axios";

class SinglePost extends Component {
  // In state, we have 2 arrays, comments and attachments
  // TODO: connect to server, get comments and attachments with API
  state = {
    // user: '',
    post: '',
    comments: [],
    attachments: [],
  };

  // constructor initialize the post_id of this post
  // this.props.location.state.post_id comes from the link to this page
  constructor(props) {
    super(props);
  }

  /* call helper functions to setup post, attachments, comments and user */
  componentDidMount() {
    this.getPostData();
    this.getAttachData();
    // this.setState({user: this.props.current_user});
    // console.log(this.props.current_user);
    // console.log(this.state.post);
    // console.log(this.state.attachments);
  }

  getPostData = () => {
    axios.get("/api/posts/" + this.props.match.params.id, this.tokenConfig())
      .then(res => {
        console.log("Get the Post data:", res.data);
        this.setState({post: res.data});
      })
      .catch(err => {
        console.log(err);
      });
  };

  getAttachData = () => {
    axios.get("/api/posts/" + this.props.match.params.id + "/attachments", this.tokenConfig())
      .then(res => {
        console.log("Get the Attach data:", res.data);
        this.setState({attachments: res.data.attachments});
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* get comments belonging to the post on this page */
  // getComments = () => {
  //   // Get comments from server
  //   // code below requires server call
  //   const all_comments = this.props.state.comments;
  //   let comments = [];
  //   if (all_comments) {
  //     comments = all_comments.filter(
  //       comment => comment.post_id === this.state.post_id
  //     );
  //     comments.forEach(comment => {
  //       comment.submitComment = this.submitComment;
  //       comment.edit_mode = false;
  //     });
  //   }
  //   return comments;
  // };

  /* Get the owner (user) of this post */
  getUser = post => {
    // Get user from server
    // code below requires server call
    let user;
    if (post) {
      const author_id = post.author_id;
      user = this.props.state.users.filter(user => user.id === author_id);
      if (user.length === 1) {
        user = user[0];
      }
    }
    return user;
  };

  /* callback passed to a Comment to delete a Comment on this page */
  deleteComment = secondary_key => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === secondary_key) {
        const all_comments = this.props.state.comments;
        for (let j = 0; j < all_comments.length; j++) {
          if (all_comments[j].id === comments[i].id) {
            all_comments.splice(j, 1);
            // server call to delete comment from database required here
            this.props.state.setAppState("comments", all_comments);
            break;
          }
        }
        break;
      }
    }
    this.setState({comments: comments});
  };

  /* callback passed to a Comment to submit a Comment on this page */
  submitComment = (secondary_key, comment_content) => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === secondary_key) {
        const all_comments = this.props.state.comments;
        all_comments.unshift({
          id: uid(rand_string()),
          username: this.props.state.current_user.username,
          user_id: this.props.state.current_user.id,
          post_id: this.state.post_id,
          content: comment_content,
          edit_mode: false
        });
        // server call to update comment to database required here
        this.props.state.setAppState("comments", all_comments);
      }
    }
    this.setState({comments: comments});
    document.getElementById("new-comment-button").removeAttribute("hidden");
  };

  /* callback passed to a Comment to edit a Comment on this page */
  editComment = secondary_key => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === secondary_key) {
        comments[i].edit_mode = true;
      }
    }
    // server call to update comment to database required here
    this.setState({comments: comments});
  };

  /* display an empty comment which can be edited in comment list */
  addComment = () => {
    if (this.props.state.current_user) {
      const comments = this.state.comments;
      comments.unshift({
        id: uid(rand_string()),
        username: this.props.state.current_user.username,
        user_id: this.props.state.current_user.id,
        edit_mode: true
      });
      this.setState({comments: comments});

      document.getElementById("new-comment-button").setAttribute("hidden", true);
    } else {
      alert("Please Sign in first, then you can create a comment.");
    }
  };

  /* redirect to the proper profile page */
  redirectProf = () => {
    const user = this.props.current_user._id;
    const author = this.state.post.author;
    if ((!user) || (!(user === author))) {
      this.props.history.push({
        pathname: "/otherprofile",
        state: {post_id: this.state.post._id}
      });
    } else {
      this.props.history.push("/userprofile");
    }
  };

  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

    // Headers
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    // If token, add to headers
    if (token) {
      config.headers['x-auth-token'] = token;
    } else {
      window.location.href = '/';
    }

    return config;
  };

  render() {
    console.log('Before render, we get all the data');
    console.log(this.state.post);
    console.log(this.state.attachments);
    console.log(this.props.current_user);
    let username = '';
    let avatar = '';
    if(this.props.current_user !== null){
      username = this.props.current_user.username;
      avatar = this.props.current_user.avatar;
      console.log(avatar);
    }
    // const avatar = 'https://images-na.ssl-images-amazon.com/images/I/711YqJG3p2L._SX425_.jpg';
    // const comments = this.state.comments ? this.state.comments : [];
    // const current_user_id = this.props.current_user._id;
    return (
      <div className="single-post-2-page">
        <div className="container">
          <div className="row">
            <div className="single-post-container col-12 col-md-9">
              <div className="single-post">
                <h3>{this.state.post.title}</h3>
                <div className="post-content">
                  <Attachment
                    key={uid(rand_string())}
                    type="show-text"
                    content={this.state.post.body}
                  />
                  {this.state.attachments.map(attachment => {
                    return (
                      <Attachment
                        key={uid(rand_string())}
                        type={attachment.type}
                        content={attachment.body}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="comment-container">
                <div>
                  <h2>Comments</h2>
                  <button
                    className="btn btn-outline-success float-right"
                    id="new-comment-button"
                    onClick={this.addComment}
                  >
                    New Comment
                  </button>
                </div>
                <div className="comments">
                  {/*{comments.map(comment => {*/}
                  {/*  return (*/}
                  {/*    <Comment*/}
                  {/*      key={comment.id}*/}
                  {/*      secondary_key={comment.id}*/}
                  {/*      user_id={comment.user_id}*/}
                  {/*      post_user_id={this.state.post.author_id}*/}
                  {/*      current_user_id={current_user_id}*/}
                  {/*      username={comment.username}*/}
                  {/*      content={comment.content}*/}
                  {/*      deleteComment={this.deleteComment}*/}
                  {/*      submitComment={this.submitComment}*/}
                  {/*      editComment={this.editComment}*/}
                  {/*      edit_mode={comment.edit_mode}*/}
                  {/*    />*/}
                  {/*  );*/}
                  {/*})}*/}
                </div>
              </div>
            </div>
            <div className="user-info-container col-12 col-6 col-md-3">
              <div className="sticky-top">
                <div className="space"></div>
                <div className="user-info" onClick={this.redirectProf}>
                  <div className="row">
                    <div className="col-lg-3 col-3">
                      <img className="avatar" src={avatar} alt=""/>
                    </div>
                    <div className="col-lg-9 col-9">
                      <strong>{username}</strong>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// getting from reducers (error and auth reducers)
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(SinglePost));
