import React, {Component} from "react";
// import Highlight from 'react-highlight';
import Editor from 'react-simple-code-editor';
import {highlight, languages} from 'prismjs';
// import Prism from "prismjs";
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';


const code = `function add(a, b) {
  return a + b;
}
`;

class AddContent extends Component {
  state = {
    code,
    
  };

  showInputFile = (event) => {
    const inputFile = event.target.files[0]

    if (inputFile != null) {
      const isJPG = inputFile.type === 'image/jpeg' ? 1 : 0;
      const isPNG = inputFile.type === 'image/png'? 1 : 0;
      const isPDF = inputFile.type === 'application/pdf' ? 1 : 0;

      if (isJPG+isPDF+isPNG > 1) {
        inputFile.status = 'error';
        console.log("You can only upload png or jpg files.");
      } else {
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({: imgReader.result});
        })
        imgReader.readAsDataURL(inputFile);
      }
    }
  }

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
      return (
        <div className="form-group">
          <h4 htmlFor="content">Code</h4>
          <Editor className="code-editor"
            value={this.state.code}
            onValueChange={code => this.setState({ code })}
            highlight={code => highlight(code, languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
        </div>
      )
    } else if (this.props.type === "youtube") {
      return (
        <div className="form-group">
          <h4>YouTube Link</h4>
          <input type="text" className="form-control"/>
        </div>
      );
    } else if (this.props.type === "image") {
      return (
        <div class="upload-btn-wrapper">
          <button class="submit-file-btn">Upload a Image</button>
          <input type="file" name="myfile"/>
        </div>
      );
    } else if (this.props.type === "image_link") {
      return (
        <div className="form-group">
          <h4>Image Link</h4>
          <input type="text" className="form-control"/>
        </div>
      );
    } else if (this.props.type === "pdf") {
      return (
        <div class="upload-btn-wrapper">
          <button class="submit-file-btn">Upload a PDF</button>
          <input type="file" name="myfile" onChange={this.showInputFile}/>
        </div>
      );
    }
  };

  render() {
    const {addInput, secondary_key} = this.props;
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
        <br/>
        <br/>
      </div>
    );
  }
}

export default AddContent;
