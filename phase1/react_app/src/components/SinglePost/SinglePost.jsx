import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../../stylesheets/single_post.scss";
import Comment from "../Comment";
import Attachment from "../Attachment";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";

class SinglePost extends Component {
  // In state, we have 2 arrays, comments and attachments
  // TODO: connect to server, get comments and attachments with API
  state = {
    post_id: "",
    title: "",
    comments: [],
    attachments: [],
    post: undefined
  };

  constructor(props) {
    super(props);
    if (this.props.location.state) {
      this.state = {
        post_id: this.props.location.state.post_id
      };
    } else {
      /* if single post is accessed by typing URL instead of clicking a link
        post_id is not available, we don't know which post to render, thus 
        redirect to login page    
      */
      this.props.history.push("/login");
    }
  }

  getPost = () => {
    const posts = this.props.state.posts;
    let post;
    if (posts) {
      post = posts.filter(post => post.id === this.state.post_id);
      if (post.length === 1) {
        post = post[0];
      }
    }
    return post;
  };

  getAttachment = () => {
    const all_attachments = this.props.state.attachments;
    let attachments = [];
    if (all_attachments) {
      attachments = all_attachments.filter(
        attachment => attachment.post_id === this.state.post_id
      );
    }
    return attachments;
  };

  getComments = () => {
    const all_comments = this.props.state.comments;
    let comments = [];
    if (all_comments) {
      comments = all_comments.filter(
        comment => comment.post_id === this.state.post_id
      );
      comments.forEach(comment => {
        comment.submitComment = this.submitComment;
        comment.edit_mode = false;
      });
    }
    return comments;
  };

  getUser = post => {
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

  componentDidMount() {
    const post = this.getPost();
    const attachments = this.getAttachment();
    const comments = this.getComments();
    this.setState({ post: post, attachments: attachments, comments: comments });
    const user = this.getUser(post);
    this.setState({ user: user });
  }

  deleteComment = secondary_key => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === secondary_key) {
        const all_comments = this.props.state.comments;
        for (let j = 0; j < all_comments.length; j++) {
          if (all_comments[j].id === comments[i].id) {
            all_comments.splice(j, 1);
            this.props.state.setAppState("comments", all_comments);
            break;
          }
        }
        break;
      }
    }
    this.setState({ comments: comments });
  };

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
        this.props.state.setAppState("comments", all_comments);
      }
    }
    this.setState({ comments: comments });
  };

  editComment = secondary_key => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id === secondary_key) {
        comments[i].edit_mode = true;
      }
    }
    this.setState({ comments: comments });
  };

  addComment = () => {
    if (this.props.state.current_user) {
      const comments = this.state.comments;
      comments.unshift({
        id: uid(rand_string()),
        username: this.props.state.current_user.username,
        user_id: this.props.state.current_user.id,
        edit_mode: true
      });
      this.setState({ comments: comments });
    } else {
      alert("Please Sign in first, then you can create a comment.");
    }
  };

  render() {
    let attachments = [];
    let title = "";
    if (this.state) {
      attachments =
        this.state.attachments === undefined ? [] : this.state.attachments;
      if (this.state.post) {
        title =
          this.state.post.title === undefined ? "" : this.state.post.title;
      }
    }
    const username = this.state.user ? this.state.user.username : "";
    const avatar = this.state.user ? this.state.user.avatar : "";
    const comments = this.state.comments ? this.state.comments : [];
    const current_user_id = this.props.state.current_user
      ? this.props.state.current_user.id
      : "";
    const post_brief_description = this.state.post
      ? this.state.post.content
      : "";
    return (
      <div className="single-post-2-page">
        <div className="container">
          <div className="row">
            <div className="single-post-container col-12 col-md-9">
              <div className="single-post">
                <h3>{title}</h3>
                <div className="post-content">
                  <Attachment
                    key={uid(rand_string())}
                    type="text"
                    content={post_brief_description}
                  />
                  {attachments.map(attachment => {
                    return (
                      <Attachment
                        key={uid(rand_string())}
                        type={attachment.type}
                        content={attachment.content}
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
                    onClick={this.addComment}
                  >
                    New Comment
                  </button>
                </div>
                <div className="comments">
                  {comments.map(comment => {
                    return (
                      <Comment
                        key={comment.id}
                        secondary_key={comment.id}
                        user_id={comment.user_id}
                        post_user_id={this.state.post.author_id}
                        current_user_id={current_user_id}
                        username={comment.username}
                        content={comment.content}
                        deleteComment={this.deleteComment}
                        submitComment={this.submitComment}
                        editComment={this.editComment}
                        edit_mode={comment.edit_mode}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              to="/userprofile"
              className="user-info-container col-12 col-6 col-md-3"
            >
              <div className="sticky-top">
                <div className="space"></div>
                <Link to="/userprofile">
                  <div className="user-info">
                    <div className="row">
                      <div className="col-lg-3 col-3">
                        <img className="avatar" src={avatar} alt="" />
                      </div>
                      <div className="col-lg-9 col-9">
                        <strong>{username}</strong>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SinglePost);
