import React, { Component } from "react";
import hljs from "highlight.js";

class Tmp extends Component {
  state = {};

  componentDidMount() {
    hljs.initHighlightingOnLoad();
    var current = React.findDOMNode(this);
    hljs.highlightBlock(current);
  }

  render() {
    return (
      <pre className="custom-json-body">
        <code className="json">{JSON.stringify(this.props.json, null, 2)}</code>
      </pre>
    );
  }
}

export default Tmp;
