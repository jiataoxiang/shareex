import React, { Component } from "react";
import "../stylesheets/comment.scss";

class Comment extends Component {
  state = {};

  submitComment = event => {
    const comment_content =
      event.target.previousElementSibling.firstElementChild.value;
    // const { submitComment, secondary_key } = this.props;
    this.props.submitComment(this.props.secondary_key, comment_content);
    // submitComment.bind(this, secondary_key, comment_content);
  };

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
    if (this.props.post_user_id === this.props.user_id) {
      const { deleteComment, secondary_key } = this.props;
      return (
        <div>
          <button className="btn btn-outline-primary float-right">Edit</button>
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

  getContentDisplay = () => {
    if (this.props.edit_mode) {
      return (
        <div className="form-group">
          {/* <h4 htmlFor="content"></h4> */}
          <textarea
            className="form-control comment-textarea"
            rows="5"
            id="content"
            placeholder="What's in your mind right now?"
          />
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
          <div className="col-sm-9">
            {this.getContentDisplay()}
            {this.getButtons()}
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default Comment;
