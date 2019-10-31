import React, { Component } from "react";
import "../../stylesheets/single_post_2.scss";

class SinglePost2 extends Component {
  state = {};
  render() {
    return (
      <div className="single-post-2-page">
        <div className="container">
          <div className="row">
            <div className="col-md-9"></div>
            <div className="col-md-3">
              <div className="user-display">
                <strong>Username</strong>
                <img
                  className="avatar"
                  src={process.env.PUBLIC_URL + "./img/saitama.jpg"}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SinglePost2;
