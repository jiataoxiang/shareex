import React, { Component } from 'react';
import '../stylesheets/comment.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class Comment extends Component {
  state = {};

  submitComment = event => {
    const comment_content =
      event.target.previousElementSibling.firstElementChild.value;
    console.log('The current comment id is: ', this.props.secondary_key);
    this.props.submitComment(
      comment_content,
      this.props.post_id,
      this.props.secondary_key,
      this.props.new_comment
    );
  };

  reportComment = e => {
    const msg = document.getElementById('report-input').value;
    document.getElementById('report-input').value = '';
    this.props.report_comment(msg);
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
    if (this.props.current_user_id === this.props.comment_user_id) {
      const { deleteComment, editComment, secondary_key } = this.props;
      console.log('This.props.key is: ', secondary_key);
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
    else{
      const { deleteComment, editComment, secondary_key } = this.props;
      console.log('This.props.key is: ', secondary_key);
      return (
        <div>
          <button
            className="btn btn-outline-primary float-right"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Report
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
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" data-dismiss="modal"
                          onClick={this.reportComment}>Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
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
          <div className="col-sm-9 content">
            {this.getContentDisplay()}
            {this.getButtons()}
          </div>
        </div>
        <hr />
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
