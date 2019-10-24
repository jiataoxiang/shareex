import React, { Component } from "react";
import "../stylesheets/post.scss";
import { uid } from "react-uid";

class Post extends Component {
  state = {};
  // constructor(props) {
  //   super(props);
  // }

  thumbClicked = event => {
    // console.log(event.target);
    alert("Thumb Up Button Clicked!");
  };

  render() {
    const { title, content, images } = this.props;

    return (
      <div className="post card">
        <h5 className="card-header">{title}</h5>
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
          <a href="/" className="btn btn-primary">
            See Details
          </a>
          {/* Thumb up button */}
          <img
            src={process.env.PUBLIC_URL + "./img/thumb_up.png"}
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
