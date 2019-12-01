import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../../stylesheets/single_post.scss';
import Comment from '../Comment';
import Attachment from '../Attachment';
import { connect } from 'react-redux';
import { rand_string } from '../../lib/util';
import { uid } from 'react-uid';
import axios from 'axios';
import store from '../../store';
import { loadUser } from '../../actions/authActions';

class SinglePost extends Component {
  // In state, we have 2 arrays, comments and attachments
  state = {
    post: '',
    comments: [],
    attachments: [],
    history_added: false,
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
    this.addToViewHistory();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('receive props');
  //   if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
  //     console.log('updated');
  //     this.addToViewHistory();
  //   }
  // }

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
        { post_id: this.props.match.params.id },
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

  // componentWillReceiveProps(nextProps) {
  //   console.log('received props');
  //   if (nextProps.current_user) {
  //     this.addToViewHistory(nextProps.current_user._id, this.props.match.params.id);
  //   }
  // }

  getPostData = () => {
    axios
      .get('/api/posts/' + this.props.match.params.id, this.tokenConfig())
      .then(res => {
        this.setState({ post: res.data });
        this.getPostAuthor(res.data.author);
        console.log('The post id we get is:', res.data._id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  getPostAuthor = user_id => {
    axios
      .get('/api/users/' + user_id, this.tokenConfig())
      .then(user => {
        this.setState({ post_author: user.data });
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
        this.setState({ attachments: res.data.attachments });
      })
      .catch(err => {
        console.log(err);
      });
  };

  /* get comments belonging to the post on this page */
  getComments = () => {
    axios
      .get('/api/comments/', {
        params: { post_id: this.props.match.params.id },
      })
      .then(comments => {
        let add_editMode = [];
        comments.data.comments.forEach(ele => {
          ele['edit_mode'] = false;
          ele['new_comment'] = false;
          add_editMode.push(ele);
          this.getCommentUsername(ele._id, ele.author);
        });
        this.setState({ comments: add_editMode });
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
        this.setState({ comments: comments });
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
        console.log(deleted);
      })
      .catch(err => {
        console.log(err);
      });
    // this.setState({comments: new_comments});
    this.getComments();
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
        })
        .catch(err => {
          console.log(err);
        });
      document.getElementById('new-comment-button').removeAttribute('hidden');
    }
    this.getComments();
  };

  /* callback passed to a Comment to edit a Comment on this page */
  editComment = comment_id => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i]._id === comment_id) {
        comments[i].edit_mode = true;
      }
    }
    this.setState({ comments: comments });
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
      this.setState({ comments: comments });

      document.getElementById('new-comment-button').setAttribute('hidden', true);
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
        state: { post_id: this.state.post._id, author: this.state.post.author },
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
    console.log('adding to fav');
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
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let cur_user_id = '';
    let username = '';
    let avatar = '';
    let post_id = '';
    if (this.props.current_user !== null) {
      cur_user_id = this.props.current_user._id;
    }
    if (this.state.post_author) {
      username = this.state.post_author.username;
      avatar = this.state.post_author.avatar;
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
    console.log(fav_disabled);
    let comment_list = [];
    if (this.state.comments) {
      comment_list = this.state.comments;
    }

    return (
      <div className="single-post-2-page">
        <div className="container">
          <div className="row">
            <div className="single-post-container col-12 col-md-9">
              <div className="single-post">
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
                    className="btn btn-outline-success float-right"
                    id="new-comment-button"
                    onClick={this.addComment}
                  >
                    New Comment
                  </button>
                </div>
                <div className="comments">
                  {(function() {
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
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="user-info-container col-12 col-6 col-md-3">
              <div className="sticky-top">
                <div className="space"></div>
                <div className="user-info">
                  <div className="row" onClick={this.redirectProf}>
                    <div className="col-lg-3 col-3">
                      <img className="avatar" src={avatar} alt="" />
                    </div>
                    <div className="col-lg-9 col-9">
                      <strong>{username}</strong>
                    </div>
                  </div>
                  <div className="row">
                    <button
                      className="btn btn-success btn-sm btn-fav btn-block"
                      onClick={this.favPost}
                      disabled={fav_disabled}
                    >
                      Favourite
                    </button>
                    <button className="btn btn-outline-danger btn-sm btn-block">Report Post</button>
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
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(SinglePost));
