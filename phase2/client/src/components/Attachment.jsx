import React, { Component } from 'react';
import '../stylesheets/attachment.scss';

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
      const url =
        this.props.content.substring(0, 5) === 'https'
          ? this.props.content
          : this.props.content.replace('http', 'https');
      return <embed className="pdf" src={url} type="application/pdf" width="100%" height="100%" />;
    }
  };

  render() {
    return <div className="attachment-component">{this.getElement()}</div>;
  }
}

export default Attachment;
