import React, { Component } from "react";

class AddContent extends Component {
  state = {};

  getContentInput = () => {
    if (this.props.type === "text") {
      return (
        <div className="form-group">
          <h4 htmlFor="content">Text</h4>
          <textarea
            className="form-control"
            rows="5"
            id="content"
            placeholder="What's in your mind right now?"
          />
        </div>
      );
    } else if (this.props.type === "code") {
    } else if (this.props.type === "youtube") {
      return (
        <div className="form-group">
          <h4>YouTube Link</h4>
          <input type="text" className="form-control" />
        </div>
      );
    } else if (this.props.type === "image") {
      return (
        <div class="upload-btn-wrapper">
          <button class="submit-file-btn">Upload a Image</button>
          <input type="file" name="myfile" />
        </div>
      );
    } else if (this.props.type === "image_link") {
      return (
        <div className="form-group">
          <h4>Image Link</h4>
          <input type="text" className="form-control" />
        </div>
      );
    } else if (this.props.type === "pdf") {
      return (
        <div class="upload-btn-wrapper">
          <button class="submit-file-btn">Upload a PDF</button>
          <input type="file" name="myfile" />
        </div>
      );
    }
  };

  render() {
    const { addInput, secondary_key } = this.props;
    return (
      <div className="add-content-component">
        <div className="content-input">{this.getContentInput()}</div>
        {/* <div className="content-input">
          <h2>{this.props.type}</h2>
        </div> */}
        <div className="add-button">
          <div className="dropdown">
            <button
              className="btn btn-outline-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Add
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button
                className="dropdown-item"
                href="new_post2"
                value="text"
                onClick={addInput.bind(this, "text", secondary_key)}
              >
                Text
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="code"
                onClick={addInput.bind(this, "code", secondary_key)}
              >
                Code
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="youtube"
                onClick={addInput.bind(this, "youtube", secondary_key)}
              >
                YouTube Link
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="image"
                onClick={addInput.bind(this, "image", secondary_key)}
              >
                Image
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="image_link"
                onClick={addInput.bind(this, "image_link", secondary_key)}
              >
                Image Link
              </button>
              <button
                className="dropdown-item"
                href="new_post2"
                value="pdf"
                onClick={addInput.bind(this, "pdf", secondary_key)}
              >
                PDF
              </button>
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default AddContent;
