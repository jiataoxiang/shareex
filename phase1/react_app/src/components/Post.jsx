import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../stylesheets/post.scss";
import { uid } from "react-uid";

class Post extends Component {
  // Get posts likes info from server
  // code below requires server call
  thumbClicked = () => {
    const posts = this.props.posts;
    console.log(this.props.current_user);
    if (
      this.props.current_user &&
      (!this.props.post.likes_user_id.includes(this.props.current_user.id) ||
        this.props.current_user.type === "admin")
    ) {
      const this_post = posts.filter(post => post.id === this.props.post.id)[0];
      this_post.likes += 1;
      this_post.likes_user_id.push(this.props.current_user.id);
      this.props.setAppState("posts", posts);
      const post_owner = this.props.users.filter(
        user => user.id === this_post.author_id
      )[0];
      // update posts likes number with server
      post_owner.likes += 1;
    } else if (this.props.current_user === undefined) {
      alert("You must first sign in to like a post.");
    } else {
      alert("You have liked the post, and you cannot like it more than once.");
    }
  };

  getImages = () => {
    const images = [];
    let count = 0;
    for (let i = 0; i < this.props.attachments.length && count < 5; i++) {
      const attachment = this.props.attachments[i];
      if (attachment.type === "image" || attachment.type === "image_link") {
        images.push(attachment.content);
        count++;
      }
    }
    return images;
  };

  render() {
    const { title, content, likes } = this.props.post;
    const images = this.getImages();
    return (
      <div className="post card">
        <Link
          to={{
            pathname: "/single_post",
            state: {
              post_id: this.props.post.id
            }
          }}
        >
          <h5 className="card-header">{title}</h5>
        </Link>

        <div className="card-body">
          {/* <h5 className="card-title">Special title treatment</h5> */}
          <p className="card-text">{content}</p>
          <div className="row">
            {images.map(image => {
              return (
                <img
                  key={uid(Math.random())}
                  src={image}
                  alt=""
                  className="img-thumbnail"
                />
              );
            })}
          </div>
          <hr />
          <Link
            to={{
              pathname: "/single_post",
              state: {
                post_id: this.props.post.id
              }
            }}
            className="btn btn-primary"
          >
            See Details
          </Link>

          <span className="likes float-right">Likes: {likes}</span>
          {/* Thumb up button */}
          <img
            src={"./img/thumb_up.png"}
            alt=""
            width="40px"
            className="float-right thumb-up-btn"
            onClick={this.thumbClicked}
          />
          {/* The code below is also a thumb up button, it's from font awesome */}
          {/* <i class="fas fa-thumbs-up float-right"></i> */}
        </div>
      </div>
    );
  }
}

export default Post;
