import React, {Component} from 'react';
import '../stylesheets/comment.scss';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

class Comment extends Component {
  state = {};

  // add a new comment to the database
  submitComment = event => {
    const comment_content = event.target.previousElementSibling.firstElementChild.value;
    this.props.submitComment(
      comment_content,
      this.props.post_id,
      this.props.secondary_key,
      this.props.new_comment,
    );
  };

  // show buttons on the page
  getButtons = () => {
    if (this.props.edit_mode) {
      return (
        <button
          className="btn btn-outline-success float-right"
          onClick={e => this.submitComment(e)}
        >
          Submit
        </button>
      );
    }
    if (this.props.current_user_id === this.props.comment_user_id) {
      const {deleteComment, editComment, secondary_key} = this.props;
      return (
        <div>
          <button
            className="btn btn-outline-primary float-right"
            onClick={editComment.bind(this, secondary_key)}
          >
            Edit
          </button>
          <button
            className="btn btn-outline-danger float-right"
            onClick={deleteComment.bind(this, secondary_key)}
          >
            Delete
          </button>
        </div>
      );
    }
  };

  // shown content on the page
  getContentDisplay = () => {
    if (this.props.edit_mode) {
      return (
        <div className="form-group">
          {/* <h4 htmlFor="content"></h4> */}
          <textarea
            className="form-control comment-textarea"
            rows="5"
            id="content"
            // value={this.props.content}
            defaultValue={this.props.content}
            // onChange={e => {}}
            placeholder="What's in your mind right now?"
          ></textarea>
        </div>
      );
    } else {
      return (
        <div className="content">
          <p>{this.props.content}</p>
        </div>
      );
    }
  };

  render() {
    return (
      <div className="comment">
        <div className="row">
          <div className="col-sm-3">
            <div className="user">
              <h5>{this.props.username}</h5>
            </div>
          </div>
          <div className="col-sm-9 content">
            {this.getContentDisplay()}
            {this.getButtons()}
          </div>
        </div>
        <hr/>
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

export default connect(mapStateToProps)(withRouter(Comment));
