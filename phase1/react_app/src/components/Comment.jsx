import React, { Component } from "react";
import "../stylesheets/comment.scss";

class Comment extends Component {
  state = {};
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
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default Comment;
