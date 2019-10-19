import React, { Component } from "react";

class PostContent extends Component {
  state = {};
  componentDidMount() {}
  render() {
    return (
      <div className="container">
        <div className="article">
          <h1 id="title">Start a New Post</h1>

          <div className="form-group">
            <p>Title:</p>
            <input type="text" className="form-control" id="tile" />
          </div>
          <div className="form-group">
            <p htmlFor="content">Content:</p>
            <textarea
              className="form-control"
              rows="5"
              id="content"
              placeholder="What's in your mind right now?"
            />
          </div>
        </div>
        <div className="addInfo">
          <div className="form-group">
            <p>Category:</p>
            <select className="form-control" id="category">
              <option>Travel</option>
              <option>Meme</option>
              <option>Question</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="form-group">
            <p>File Type:</p>
            <select className="form-control" id="file_type">
              <option>PDF</option>
              <option>JPEG</option>
              <option>PNG</option>
              <option>DOCS</option>
            </select>
          </div>
          <input type="file" className="form-control-file border" id={"file"} />
        </div>
      </div>
    );
  }
}

export default PostContent;
