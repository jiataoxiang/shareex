import React, { Component } from "react";

class AddContent extends Component {
  state = {};

  render() {
    const { addInput, secondary_key } = this.props;
    return (
      <div className="add-content-component">
        <div className="content-input">
          <h1>{this.props.title}</h1>
        </div>
        <div className="dropdown add-button">
          <button
            className="btn btn-success dropdown-toggle"
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
    );
  }
}

export default AddContent;
