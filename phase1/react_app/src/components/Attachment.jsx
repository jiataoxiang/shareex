import React, { Component } from "react";
import "../stylesheets/attachment.scss";

class Attachment extends Component {
  state = {};

  getElement = () => {
    if (this.props.type === "text") {
      return <p>{this.props.content}</p>;
    } else if (this.props.type === "code") {
    } else if (this.props.type === "youtube") {
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
    } else if (this.props.type === "image") {
      return <img src={this.props.content} alt="" />;
    } else if (this.props.type === "image_link") {
      return (
        <iframe
          width="100%"
          height="100"
          title="image"
          src={this.props.content}
          frameBorder="0"
        ></iframe>
      );
    } else if (this.props.type === "pdf") {
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
