import React, {Component} from "react";
import "../stylesheets/comment.scss";
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import axios from "axios";

class Comment extends Component {
  state = {};

  submitComment = (event) => {
    const comment_content = event.target.previousElementSibling.firstElementChild.value;
    console.log("The current comment id is: ", this.props.secondary_key);
    this.props.submitComment(comment_content, this.props.post_id, this.props.secondary_key);
  };

  getButtons = () => {
    console.log("Current edit_mode: ", this.props.edit_mode);
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
      console.log("This.props.key is: ", secondary_key);
      return (
        <div>
          <button
            className="btn btn-outline-primary float-right"
            onClick={editComment.bind(this, secondary_key)}
          >
            Edit
          </button>
          {/*<button*/}
          {/*  className="btn btn-outline-danger float-right"*/}
          {/*  onClick={deleteComment.bind(this, key)}*/}
          {/*>*/}
          {/*  Delete*/}
          {/*</button>*/}
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
          <div className="col-sm-9">
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
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Comment));