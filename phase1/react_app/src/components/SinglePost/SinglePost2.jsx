import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../stylesheets/single_post_2.scss";
import Comment from "../Comment";
import Attachment from "../Attachment";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";

class SinglePost2 extends Component {
  // In state, we have 2 arrays, comments and attachments
  // TODO: connect to server, get comments and attachments with API
  state = {
    user: {
      user_id: "1123",
      username: "Peter"
    },
    comments: [
      {
        username: "Peter",
        user_id: "1123",
        content: "Such a nice post",
        key: uid(rand_string()),
        edit_mode: false,
        submitComment: this.submitComment
      },
      {
        username: "Bob",
        user_id: "1122",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a porttitor odio. Sed blandit maximus elit et mattis. Donec quis arcu eu risus condimentum feugiat. Fusce sit amet pharetra lectus. Ut vehicula cursus elit, non posuere libero mattis non. Donec aliquet nunc scelerisque diam hendrerit scelerisque. Donec fringilla risus at nisi gravida, non vulputate risus gravida. Etiam condimentum, tortor sed scelerisque pretium, lorem nisl venenatis neque, a vehicula mauris velit sed arcu. Vestibulum eleifend felis sed ipsum hendrerit dignissim. Fusce id nibh enim. Nullam metus neque, pharetra quis gravida in, pharetra tincidunt ex.",
        key: uid(rand_string()),
        edit_mode: false,
        submitComment: this.submitComment
      },
      {
        username: "Peter",
        user_id: "1123",
        content:
          " Vestibulum eleifend felis sed ipsum hendrerit dignissim. Fusce id nibh enim. Nullam metus neque, pharetra quis gravida in, pharetra tincidunt ex.",
        key: uid(rand_string()),
        edit_mode: false,
        submitComment: this.submitComment
      },
      {
        username: "William",
        user_id: "1124",
        content:
          "Ut vehicula cursus elit, non posuere libero mattis non. Donec aliquet nunc scelerisque diam hendrerit scelerisque. Donec fringilla risus at nisi gravida, non vulputate risus gravida. Etiam condimentum, tortor sed scelerisque pretium, lorem nisl venenatis neque, a vehicula mauris velit sed arcu.",
        key: uid(rand_string()),
        edit_mode: false,
        submitComment: this.submitComment
      }
    ],
    attachments: [
      {
        type: "youtube",
        content: "https://www.youtube.com/embed/dMVy3BQB314"
      },
      {
        type: "text",
        content:
          "Praesent et leo eget mauris imperdiet tempus. Maecenas id orci augue. In vel enim vel leo commodo placerat. Nulla sed commodo diam, a laoreet ipsum. Ut eu massa dictum, iaculis felis ac, dapibus sem. Integer ut velit mi. Phasellus in orci tellus. Morbi quis aliquam sapien, nec rhoncus odio. Curabitur pellentesque mi quis mauris consectetur, in faucibus libero fermentum. Praesent rhoncus metus ut ultricies interdum. Maecenas facilisis purus id sapien efficitur, accumsan dictum justo dapibus. In vitae congue nibh. Ut sollicitudin nulla mollis massa mattis iaculis."
      },
      {
        type: "text",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac purus vitae orci congue bibendum ut sed velit. Duis nec sodales quam, sit amet sollicitudin nibh. Praesent faucibus tortor at faucibus maximus. In euismod nisi in tincidunt convallis. In non velit vitae ligula semper ornare vitae id odio. Integer cursus massa malesuada imperdiet pharetra. Fusce aliquam diam risus, eu vulputate velit auctor elementum."
      },
      {
        type: "image",
        content: process.env.PUBLIC_URL + "/images/SSL.png"
      },
      {
        type: "pdf",
        content:
          process.env.PUBLIC_URL + "/files/AWS_Deploy_web_app_with_SSL.pdf"
      },
      {
        type: "text",
        content:
          "Nam interdum sapien et nibh eleifend scelerisque vitae eu mauris. Nulla facilisi. Nam eget neque vitae nunc dignissim semper. Curabitur sed gravida neque. Proin blandit semper mollis. Aenean egestas pulvinar sapien. Sed auctor, neque non consequat vulputate, neque turpis tincidunt sem, eu dictum ipsum metus at metus. Aenean accumsan lectus eu porttitor luctus. Etiam fringilla gravida fringilla. Phasellus in rhoncus ipsum. Mauris congue libero sed mollis tincidunt. Sed condimentum sapien ligula. Sed porttitor, nulla ac tristique suscipit, dui lectus porttitor est, ac vulputate urna mauris ut nibh. Curabitur quis quam orci. Donec et accumsan sapien."
      },
      {
        type: "image_link",
        content:
          "https://chiefit.me/wp-content/uploads/2019/06/Amazon-Web-Services_logo835x396.png"
      }
    ]
  };

  // Generic handler for whenever we type in an input box.
  // We change the state for the particular property bound to the textbox from the event.
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // 'this' is bound to the component in this arrow function.
    this.setState({
      [name]: value // [name] sets the object property name to the value of the 'name' variable.
    });
  };

  deleteComment = secondary_key => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].key === secondary_key) {
        comments.splice(i, 1);
      }
    }
    this.setState({ comments: comments });
  };

  submitComment = (secondary_key, comment_content) => {
    const comments = this.state.comments;
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].key === secondary_key) {
        comments.splice(i, 1);
        comments.splice(i, 0, {
          username: "Peter",
          user_id: "1123",
          content: comment_content,
          key: uid(rand_string()),
          edit_mode: false
        });
      }
    }
    this.setState({ comments: comments });
  };

  addComment = () => {
    const comments = this.state.comments;
    comments.unshift({
      username: "Peter",
      user_id: "1123",
      // content: "Such a nice post",
      key: uid(rand_string()),
      edit_mode: true
    });
    this.setState({ comments: comments });
  };

  render() {
    return (
      <div className="single-post-2-page">
        <div className="container">
          <div className="row">
            <div className="single-post-container col-12 col-md-9">
              <div className="single-post">
                <h3>
                  How to deploy Nodejs Web app on AWS EC2, with SSL certificate
                </h3>
                <div className="post-content">
                  {this.state.attachments.map(attachment => {
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
                  {this.state.comments.map(comment => {
                    return (
                      <Comment
                        key={uid(rand_string())}
                        secondary_key={comment.key}
                        user_id={comment.user_id}
                        post_user_id={this.state.user.user_id}
                        username={comment.username}
                        content={comment.content}
                        deleteComment={this.deleteComment}
                        submitComment={this.submitComment}
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
                        <img
                          className="avatar"
                          src={process.env.PUBLIC_URL + "/img/saitama.jpg"}
                          alt=""
                        />
                      </div>
                      <div className="col-lg-9 col-9">
                        <strong>Username</strong>
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

export default SinglePost2;
