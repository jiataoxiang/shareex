import React, { Component } from "react";
import "../../stylesheets/new_post2.scss";
import AddContent from "./AddContent";

class NewPost2 extends Component {
  state = {};
  render() {
    return (
      <div className="new-post2-page">
        <div className="container">
          <h1>New Post</h1>
          <AddContent />
          <ion-icon name="add-circle"></ion-icon>
        </div>
      </div>
    );
  }
}

export default NewPost2;
