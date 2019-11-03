import React, {Component} from "react";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import Attachment from "../Attachment";
import {uid} from "react-uid";
import {rand_string} from "../../lib/util";

const code = `function add(a, b) {
  return a + b;
}
`;

class AddContent extends Component {
  state = {code};

  getContentInput = () => {
    const {addedAttachmentFile, addedAttachmentLink, title} = this.props;
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
      return (
        <div className="code-container">
          <div className="form-group">
            <h4 htmlFor="content">Code</h4>
            <Editor
              className="code-editor"
              value={this.state.code}
              onValueChange={code => this.setState({code})}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12
              }}
            />
          </div>
        </div>
      );
    } else if (this.props.type === "youtube") {
      return (
        <div className="form-group">
          <h4>YouTube Link</h4>
          <input type="text" className="form-control" onChange={addedAttachmentLink.bind(this)}/>
        </div>
      );
    } else if (this.props.type === "image") {
      return (
        <div className="upload-btn-wrapper">
          <button className="submit-file-btn">Upload a Image</button>
          <input type="file" name="myfile" onChange={addedAttachmentFile.bind(this)}/>
        </div>
      );
    } else if (this.props.type === "image_link") {
      return (
        <div className="form-group">
          <h4>Image Link</h4>
          <input type="text" className="form-control" onChange={addedAttachmentLink.bind(this)}/>
        </div>
      );
    } else if (this.props.type === "pdf") {
      return (
        <div className="upload-btn-wrapper">
          <button className="submit-file-btn">Upload a PDF</button>
          <input type="file" name="myfile" onChange={addedAttachmentFile.bind(this)}/>
        </div>
      );
    } else if (this.props.type === 'pdf_attach') {
      return (
        <Attachment
          key={uid(rand_string())}
          type={'pdf'}
          content={process.env.PUBLIC_URL + "/files/AWS_Deploy_web_app_with_SSL.pdf"}
        />
      );
    } else if (this.props.type === 'image_attach') {
      return (
        <Attachment
          key={uid(rand_string())}
          type={'image'}
          content={process.env.PUBLIC_URL + "/img/SSL.png"}
        />
      );
    } else if (this.props.type === 'youtube_attach') {
      return (
        <Attachment
          key={uid(rand_string())}
          type={'youtube'}
          content={title}
        />
      );
    } else if(this.props.type === 'image_link_attach'){
      return (
        <Attachment
          key={uid(rand_string())}
          type={'image_link'}
          content={title}
        />
      );
    }
  };

  render() {
    const {addInput, secondary_key} = this.props;
    return (
      <div className="add-content-component">
        <div className="content-input">{this.getContentInput()}</div>
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
        <br/>
        <br/>
      </div>
    );
  }
}

export default AddContent;
