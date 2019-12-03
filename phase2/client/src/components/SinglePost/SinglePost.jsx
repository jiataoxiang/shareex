import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import '../../stylesheets/single_post.scss';
import Comment from '../Comment';
import Attachment from '../Attachment';
import {connect} from 'react-redux';
import {rand_string} from '../../lib/util';
import {uid} from 'react-uid';
import axios from 'axios';
import store from '../../store';
import {loadUser} from '../../actions/authActions';

class SinglePost extends Component {
  // In state, we have 2 arrays, comments and attachments
  state = {
    post: '',
    comments: [],
    attachments: [],
    history_added: false,
  };

  /* call helper functions to setup post, attachments, comments and user */
  componentDidMount() {
    this.getPostData();
    this.getAttachData();
    this.getComments();
    this.addToViewHistory();
  }

  addToViewHistory = () => {
    let user_id;
    if (this.props.location.state) {
      console.log('The current user id is not null: ', this.props.location.state.current_user_id);
      user_id = this.props.location.state.current_user_id
        ? this.props.location.state.current_user_id
        : user_id;
    }
    if (!user_id) {
      return;
    }
    console.log('calling to add view history');
    axios
      .patch(
        `/api/users/${user_id}/add-view-history`,
        {post_id: this.props.match.params.id},
        this.tokenConfig(),
      )
      .then(res => {
        console.log('added to view history');
        console.log(res.data);
        store.dispatch(loadUser());
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillReceiveProps(nextProps) {
    // console.log('received props');
    if (nextProps.current_user) {
      // this.addToViewHistory(nextProps.current_user._id, this.props.match.params.id);
      this.setState({cur_user_id: nextProps.current_user._id});
      this.setState({cur_user: nextProps.current_user});
    }
  }

  getPostData = () => {
    axios
      .get('/api/posts/' + this.props.match.params.id, this.tokenConfig())
      .then(res => {
        this.setState({post: res.data});
        this.getPostAuthor(res.data.author);
        console.log('The post id we get is:', res.data._id);
      })
      .catch(err => {
        this.props.history.push();
        console.log(err);
      });
  };

  getPostAuthor = user_id => {
    axios
      .get('/api/users/' + user_id, this.tokenConfig())
      .then(user => {
        this.setState({post_author: user.data});
      })
      .catch(err => {
        console.log(err);
      });
  };

  getAttachData = () => {
    axios
      .get('/api/posts/' + this.props.match.params.id + '/attachments', this.tokenConfig())
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
    axios
      .get('/api/comments/', {
        params: {post_id: this.props.match.params.id},
      })
      .then(comments => {
        let add_editMode = [];
        comments.data.comments.forEach(ele => {
          ele['edit_mode'] = false;
          ele['new_comment'] = false;
          add_editMode.push(ele);
          this.getCommentUsername(ele._id, ele.author);
        });
        this.setState({comments: add_editMode});
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCommentUsername = (comment_id, id) => {
    axios
      .get('/api/users/' + id, this.tokenConfig())
      .then(user => {
        const comments = this.state.comments;
        for (let i = 0; i < comments.length; i++) {
          if (comments[i]._id === comment_id) {
            comments[i].username = user.data.username;
          }
        }
        this.setState({comments: comments});
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* callback passed to a Comment to delete a Comment on this page */
  deleteComment = comment_id => {
    const comments = this.state.comments;
    const new_comments = [];
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].id !== comment_id) {
        new_comments.push(comments[i]);
      }
    }
    axios
      .delete('/api/comments/' + comment_id)
      .then(deleted => {
        this.getComments();
        console.log(deleted);
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* callback passed to a Comment to submit a Comment on this page */
  submitComment = (comment_content, post_id, comment_id, new_comment) => {
    if (new_comment) {
      // if this is a new comment
      const a_comment = {
        author: this.props.current_user._id,
        post_id: post_id,
        body: comment_content,
      };
      const comments = this.state.comments;
      const original_comment_id = comments[0]._id;
      comments.splice(0, 1, {
        _id: original_comment_id,
        author: this.props.current_user.username,
        body: comment_content,
        edit_mode: false,
        new_comment: false,
      });
      axios
        .post('/api/comments/', a_comment)
        .then(comments => {
          console.log('Posted the comment data:', comments.data);
          this.getComments();
        })
        .catch(err => {
          console.log(err);
        });
      document.getElementById('new-comment-button').removeAttribute('hidden');
    } else {
      // if this is a existed comment
      const comments = this.state.comments;
      let modified = {};
      for (let i = 0; i < comments.length; i++) {
        if (comments[i]._id === comment_id) {
          comments[i].body = comment_content;
          comments[i].edit_mode = false;
          modified['body'] = comment_content;
        }
      }

      axios
        .patch('/api/comments/' + comment_id, modified)
        .then(comments => {
          console.log('Modified the comment data:', comments.data);
          this.getComments();
        })
        .catch(err => {
          console.log(err);
        });
      document.getElementById('new-comment-button').removeAttribute('hidden');
    }
  };

  /* callback passed to a Comment to edit a Comment on this page */
  editComment = comment_id => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
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
      comments.unshift({
        _id: uid(rand_string()),
        author: this.props.current_user.username,
        body: '',
        edit_mode: true,
        new_comment: true,
      });
      this.setState({comments: comments});

      document.getElementById('new-comment-button').setAttribute('hidden', true);
    } else {
      alert('Please Sign in first, then you can create a comment.');
    }
  };

  redirectNewPost = () => {
    if (this.props.current_user._id !== this.state.post.author) {
      alert("You cannot edit other's post.");
    } else {
      this.props.history.push({
        pathname: '/edit_post',
        state: {post: this.state.post, attachments: this.state.attachments, edit_mode: true},
      });
    }
  };

  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

    // Headers
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    // If token, add to headers
    if (token) {
      config.headers['x-auth-token'] = token;
    } else {
      window.location.href = '/';
    }

    return config;
  };

  favPost = () => {
    axios
      .patch(
        '/api/posts/add-fav',
        {
          post_id: this.state.post._id,
          user_id: this.props.current_user._id,
        },
        this.tokenConfig(),
      )
      .then(res => {
        console.log('faved the post');
        console.log(res.data);
        store.dispatch(loadUser());
      })
      .catch(err => {
        console.log(err);
      });
  };

  submitReport = () => {
    const msg = document.getElementById('report-input').value;
    if (msg === '') {
      alert('Report message could not be empty.');
    } else {
      document.getElementById('report-input').value = '';
      const notification = {
        from: this.state.cur_user_id,
        body: msg,
        link: "/single_post/" + this.props.match.params.id,
      };
      axios.post("/api/notifications/to-admin", (notification), this.tokenConfig())
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  deletePost = () => {
    axios.delete("/api/posts/" + this.props.match.params.id, this.tokenConfig())
      .then(res => {
        this.props.history.push('/');
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });

  };

  reportComment = (msg) => {
    const notification = {
      from: this.state.cur_user_id,
      body: msg,
      link: "/single_post/" + this.props.match.params.id,
    };
    axios.post("/api/notifications/to-admin", (notification), this.tokenConfig())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let cur_user_id = '';
    let post_author_id = '';
    let username = '';
    let avatar = '';
    let post_id = '';
    let cur_user_admin = true;
    let is_cur_user;
    if (this.state.cur_user) {
      cur_user_admin = this.state.cur_user.admin;
    }
    if (!this.props.isAuthenticated) this.props.history.push('/');

    if (this.props.current_user !== null) {
      cur_user_id = this.props.current_user._id;
    }
    if (this.state.post_author) {
      post_author_id = this.state.post_author._id;
      username = this.state.post_author.username;
      avatar = this.state.post_author.avatar;
    }
    if (post_author_id && cur_user_id) {
      is_cur_user = post_author_id === cur_user_id;
    }
    let fav_disabled = false;
    if (this.state.post) {
      post_id = this.state.post._id;
      if (this.props.isAuthenticated) {
        if (this.props.current_user.favs) {
          fav_disabled = this.props.current_user.favs.includes(post_id);
        }
      }
    }

    let comment_list = [];
    if (this.state.comments) {
      comment_list = this.state.comments;
    }

    return (
      <div className="single-post-2-page">
        <div className="container-fluid">
          <div className="row">
            <div className="single-post-container col-12 col-md-9">
              <div className="single-post">
                {this.state.cur_user_id === this.state.post.author ? (
                  <div className="edit-button">
                    <button
                      className="btn btn-outline-success btn-outline-danger"
                      type="button"
                      id="delete-post-btn"
                      onClick={this.deletePost}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-outline-success"
                      type="button"
                      onClick={this.redirectNewPost}
                    >
                      Edit
                    </button>
                  </div>
                ) : null}
                <h2>{this.state.post.title}</h2>
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
                  <h3>Comments</h3>
                  <button
                    className="btn btn-light float-right"
                    id="new-comment-button"
                    onClick={this.addComment}
                  >
                    New Comment
                  </button>
                </div>
                <div className="comments">
                  {(function () {
                    if (comment_list.length === 0) {
                      return (
                        <React.Fragment>
                          <h5 className="text-center">No Comments So Far</h5>
                        </React.Fragment>
                      );
                    }
                  })()}
                  {comment_list.map(comment => {
                    return (
                      <Comment
                        key={comment._id}
                        secondary_key={comment._id}
                        comment_user_id={comment.author}
                        post_user_id={this.state.post.author}
                        current_user_id={cur_user_id}
                        username={comment.username}
                        content={comment.body}
                        post_id={post_id}
                        deleteComment={this.deleteComment}
                        submitComment={this.submitComment}
                        editComment={this.editComment}
                        edit_mode={comment.edit_mode}
                        new_comment={comment.new_comment}
                        report_comment={this.reportComment}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-12 col-6 col-md-3">
              <div className="user-info-container">
                <div className="user-info">
                  <Link to={`/otherprofile/${this.state.post.author}`}/>
                  <div className="row">
                    <div className="col-lg-3 col-3">
                      <img className="avatar" src={avatar} alt=""/>
                    </div>
                    <div className="col-lg-9 col-9">
                      <strong id="username-display">{username}</strong>
                    </div>
                  </div>
                </div>
                {cur_user_admin || is_cur_user ? null :
                  <div className="row">
                    <button
                      className="btn btn-success btn-sm btn-fav btn-block"
                      onClick={this.favPost}
                      disabled={fav_disabled}
                    >
                      Favourite
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm btn-block"
                      data-toggle="modal"
                      data-target="#exampleModalCenter"
                    >Report Post
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog"
                         aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                      <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Report this post.</h5>
                          </div>
                          <div className="modal-body">
                            <div className="input-group mb-3">
                              <input type="text" className="form-control" placeholder="Enter your report information."
                                     aria-label="Recipient's username" aria-describedby="basic-addon2"
                                     id="report-input"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
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
auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(SinglePost));
