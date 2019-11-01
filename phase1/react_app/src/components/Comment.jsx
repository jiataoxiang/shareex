import React, { Component } from "react";
import "../stylesheets/comment.scss";

class Comment extends Component {
  state = {};

  getButtons = () => {
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
            <div className="content">
              <p>{this.props.content}</p>
            </div>
            {this.getButtons()}
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default Comment;
