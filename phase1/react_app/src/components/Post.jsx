import React, { Component } from "react";
import "../stylesheets/post.css";

class Post extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0
    };
  }
  render() {
    return (
      <div>
        <div className="post card">
          <h5 className="card-header">Featured</h5>
          <div className="card-body">
            <h5 className="card-title">Special title treatment</h5>
            <p className="card-text">
              With supporting text below as a natural lead-in to additional
              content.
            </p>
            <a href="/" className="btn btn-primary">
              Go somewhere
            </a>
            <img
              src={process.env.PUBLIC_URL + "./img/thumb_up.png"}
              width="30px"
              className="float-right"
            />
            {/* The code below is also a thumb up button, it's from font awesome */}
            {/* <i class="fas fa-thumbs-up float-right"></i> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
