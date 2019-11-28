import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import '../../stylesheets/single_post.scss';
import Comment from '../Comment';
import Attachment from '../Attachment';
import {connect} from 'react-redux';
import {rand_string} from '../../lib/util';
import {uid} from 'react-uid';
import axios from 'axios';
import {ObjectID} from "mongoose";

class SinglePost extends Component {
  // In state, we have 2 arrays, comments and attachments
  // TODO: connect to server, get comments and attachments with API
  state = {
    post: '',
    comments: [],
    attachments: []
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
    this.getComments();
    // this.addToViewHistory();
  }

  addToViewHistory = () => {
    // axios.patch(`/api/users/${this.props.current_user._id}/view-history`, {post_id: }).then(res => {
    //   console.log(res.data);
    // }).catch(err => {
    //   console.log(err);
    // })
  };

  getPostData = () => {
    axios
      .get('/api/posts/' + this.props.match.params.id, this.tokenConfig())
      .then(res => {
        // console.log("Get the Post data:", res.data);
        this.setState({post: res.data});
        // this.getPostUser(res.data.author);
      })
      .catch(err => {
        console.log(err);
      });
  };

  getAttachData = () => {
    axios
      .get(
        '/api/posts/' + this.props.match.params.id + '/attachments',
        this.tokenConfig()
      )
      .then(res => {
        // console.log("Get the Attach data:", res.data);
        this.setState({attachments: res.data.attachments});
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* get comments belonging to the post on this page */
  getComments = () => {
    // Get comments from server
    // code below requires server call
    // const all_comments = this.props.state.comments;
    // let comments = [];
    // if (all_comments) {
    //   comments = all_comments.filter(
    //     comment => comment.post_id === this.state.post_id
    //   );
    //   comments.forEach(comment => {
    //     comment.submitComment = this.submitComment;
    //     comment.edit_mode = false;
    //   });
    // }
    // return comments;
    axios
      .get('/api/comments/', {
        params: {post_id: this.props.match.params.id}
      })
      .then(comments => {
        console.log('Get the Comments data:', comments.data);
        let add_editMode = [];
        comments.data.comments.forEach(ele => {
          // console.log("In the loop, the cur user id is: ", this.props.current_user._id);
          // console.log("In the loop, the cur user id is: ", ele._id);
          ele['edit_mode'] = false;
          add_editMode.push(ele);
        });
        this.setState({comments: add_editMode});
      })
      .catch(err => {
        console.log(err);
      });
  };

  // getPostUser = user_id => {
  //   console.log("The current user is authenticated: ", this.props.isAuthenticated);
  //   axios
  //     .get('/api/users/' + user_id)
  //     .then(user => {
  //       console.log('The post user is:!!!!!!!!!!!!', user);
  //       this.setState({ post_user: user.data });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  /* callback passed to a Comment to delete a Comment on this page */
  // deleteComment = secondary_key => {
  //   const comments = this.state.comments;
  //   for (let i = 0; i < comments.length; i++) {
  //     if (comments[i].id === secondary_key) {
  //       const all_comments = this.props.state.comments;
  //       for (let j = 0; j < all_comments.length; j++) {
  //         if (all_comments[j].id === comments[i].id) {
  //           all_comments.splice(j, 1);
  //           // server call to delete comment from database required here
  //           this.props.state.setAppState("comments", all_comments);
  //           break;
  //         }
  //       }
  //       break;
  //     }
  //   }
  //   this.setState({comments: comments});
  // };

  /* callback passed to a Comment to submit a Comment on this page */
  submitComment = (comment_content, post_id, comment_id) => {
    // const comments = this.state.comments;
    // for (let i = 0; i < comments.length; i++) {
    //   if (comments[i].id === secondary_key) {
    //     const all_comments = this.props.state.comments;
    //     all_comments.unshift({
    //       id: uid(rand_string()),
    //       username: this.props.state.current_user.username,
    //       user_id: this.props.state.current_user.id,
    //       post_id: this.state.post_id,
    //       content: comment_content,
    //       edit_mode: false
    //     });
    //     // server call to update comment to database required here
    //     this.props.state.setAppState("comments", all_comments);
    //   }
    // }
    // this.setState({comments: comments});
    // console.log("Submit button clicked!:  ", post_id);
    if(!comment_id){  // if this is a new comment
      const a_comment = {
        author: this.props.current_user._id,
        post_id: post_id,
        body: comment_content
      };
      // put the newly-added comment to our state
      const comments = this.state.comments;
      const original_comment_id = comments[0]._id;
      // console.log('The commment submitted with id: ', original_comment_id);
      comments.splice(0, 1, {
        _id: original_comment_id,
        author: this.props.current_user.username,
        body: comment_content,
        edit_mode: false
      });
      this.setState({comments: comments});
      axios
        .post('/api/comments/', a_comment)
        .then(comments => {
          console.log('Posted the comment data:', comments.data);
        })
        .catch(err => {
          console.log(err);
        });
      document.getElementById('new-comment-button').removeAttribute('hidden');
    } else {  // if this is a existed comment
      console.log("Correct log get called!");
      const comments = this.state.comments;
      let modified = {};
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === comment_id) {
          console.log("Gotta u!!");
          comments[i].body = comment_content;
          comments[i].edit_mode = false;
          modified["body"] = comment_content;
        }
      }
      this.setState({comments: comments});

      axios
        .patch('/api/comments/'+comment_id, modified)
        .then(comments => {
          console.log('Modified the comment data:', comments.data);
        })
        .catch(err => {
          console.log(err);
        });
      document.getElementById('new-comment-button').removeAttribute('hidden');
    }
  };

  /* callback passed to a Comment to edit a Comment on this page */
  editComment = comment_id => {
    console.log("Edit get called!");
    const comments = this.state.comments;
    console.log("Current comments are: ", comments);
    for (let i = 0; i < comments.length; i++) {
      console.log('And the clicked comment id is: ', comment_id, comments[i]._id);
      if (comments[i]._id === comment_id) {
        comments[i].edit_mode = true;
      }
    }
    this.setState({comments: comments});
  };

  /* display an empty comment which can be edited in comment list */
  addComment = () => {
    if (this.props.current_user._id) {
      const comments = this.state.comments;
      const org_length = comments.length;
      comments.unshift({
        _id: uid(rand_string()),
        author: this.props.current_user.username,
        // user_id: this.props.state.current_user.id,
        body: '',
        edit_mode: true
      });
      // console.log("Comments list after added new stuff:  ", comments[0]);
      // console.log("Comments list after added new stuff:  ", comments[1]);
      this.setState({comments: comments});

      document
        .getElementById('new-comment-button')
        .setAttribute('hidden', true);
    } else {
      alert('Please Sign in first, then you can create a comment.');
    }
  };

  /* redirect to the proper profile page */
  redirectProf = () => {
    const user = this.props.current_user._id;
    const author = this.state.post.author;
    if (!user || !(user === author)) {
      this.props.history.push({
        pathname: '/otherprofile',
        state: {post_id: this.state.post._id, author: this.state.post.author}
      });
    } else {
      this.props.history.push('/userprofile');
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
    // console.log('Comment list length', this.state.comments.length);
    // console.log('Comment list content', this.state.comments);
    // console.log('Before render, we get all the data');
    // console.log(this.state.post);
    // console.log(this.state.attachments);
    // console.log(this.props.current_user);
    let cur_user_id = '';
    let username = '';
    let avatar = '';
    let post_id = '';
    if (this.props.current_user !== null) {
      cur_user_id = this.props.current_user._id;
      username = this.props.current_user.username;
      avatar = this.props.current_user.avatar;
    }
    if (this.state.post) {
      post_id = this.state.post._id;
    }
    let comment_list = [];
    if (this.state.comments) {
      comment_list = this.state.comments;
    }
    // console.log('The comment_list is: ', comment_list);

    // const comments = this.state.comments ? this.state.comments : [];
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
                  {comment_list.map(comment => {
                    return (
                      <Comment
                        key={comment._id}
                        secondary_key={comment._id}
                        comment_user_id={comment.author}
                        post_user_id={this.state.post.author}
                        current_user_id={cur_user_id}
                        username={comment.author}
                        content={comment.body}
                        post_id={post_id}
                        // deleteComment={this.deleteComment}
                        submitComment={this.submitComment}
                        editComment={this.editComment}
                        edit_mode={comment.edit_mode}
                      />
                    );
                  })}
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
