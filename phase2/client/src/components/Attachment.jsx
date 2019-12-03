import React, { Component } from 'react';
import '../stylesheets/attachment.scss';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

class Attachment extends Component {
  state = {};

  // show the generate and return the specified <Attachment> tag
  getElement = () => {
    if (this.props.type === 'text') {
      return (
        <div className="form-group">
          <h4 htmlFor="content">Text</h4>
          <textarea
            className="form-control"
            rows="5"
            id="content"
            placeholder="What's in your mind right now?"
            onChange={this.props.sendTextBack}
            defaultValue={this.props.content}
          />
        </div>
      );
    } else if (this.props.type === 'show-text') {
      return (
        <div className="form-group">
          <p>{this.props.content}</p>
        </div>
      );
    } else if (this.props.type === 'code') {
      return (
        <div className="code-container">
          <div className="form-group">
            <h4 htmlFor="content">Code</h4>
            <Editor
              className="code-editor"
              value={this.props.content}
              onValueChange={this.props.sendCodeBack}
              highlight={code => highlight(code, languages.js)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            />
          </div>
        </div>
      );
    } else if (this.props.type === 'youtube') {
      return (
        <iframe
          width="100%"
          height="400"
          title="video"
          src={this.props.content}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else if (this.props.type === 'image') {
      return <img src={this.props.content} alt="" />;
    } else if (this.props.type === 'image_link') {
      return (
        <div className="form-group">
          <img
            alt=""
            width="100%"
            height="100%"
            title="image"
            src={this.props.content}
            frameBorder="0"
          />
        </div>
      );
    } else if (this.props.type === 'pdf') {
      return (
        <embed
          className="pdf"
          src={this.props.content}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      );
    }
  };

  render() {
    return <div className="attachment-component">{this.getElement()}</div>;
  }
}

export default Attachment;
