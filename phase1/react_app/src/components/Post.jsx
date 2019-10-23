import React, { Component } from "react";
import "../stylesheets/post.scss";

class Post extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }

  thumbClicked = event => {
    // console.log(event.target);
    alert("Thumb Up Button Clicked!");
  };

  render() {
    return (
      <div className="post card">
        <h5 className="card-header">Featured</h5>
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">
            With supporting text below as a natural lead-in to additional
            content.
          </p>
          <div className="row">
            <img
              src={process.env.PUBLIC_URL + "./img/logo_S.png"}
              className="img-thumbnail"
              alt=""
            ></img>
            <img
              src={process.env.PUBLIC_URL + "./img/logo_O.png"}
              className="img-thumbnail"
              alt=""
            ></img>
            <img
              src={process.env.PUBLIC_URL + "./img/logo_X.png"}
              className="img-thumbnail"
              alt=""
            ></img>
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
