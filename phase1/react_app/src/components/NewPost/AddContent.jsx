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
  state = {
    code_data: code
  };

  // handle the input link
  handleInputLink = (event) => {
    this.setState({input_link: event.target.value});
  };

  // send the input link to the NewPost component
  sendLinkBack = (event) => {
    const {addedAttachmentLink} = this.props;
    const type = event.target.id === 'youtube' ? 'youtube' : 'image_link';
    addedAttachmentLink(this.state.input_link, type);
  };

  // send the input text to the NewPost component
  sendTextBack = (event) => {
    const {addedAttachmentWords, secondary_key} = this.props;
    // console.log(event.target.value);
    // this.state.text = event.target.value;
    this.setState({text: event.target.value});
    addedAttachmentWords(event.target.value, 'text', secondary_key);
  };

  // send the input code to the NewPost component
  sendCodeBack = (event) => {
    const {addedAttachmentWords, secondary_key} = this.props;
    // console.log('the code is: '+event);
    this.setState({code_data: event});
    addedAttachmentWords(event, 'code', secondary_key);
  };

  // generate and return the required attachment
  getContentInput = () => {
    // const {addedAttachmentFile, addedAttachmentLink, title} = this.props;
    const {addedAttachmentFile, title} = this.props;
    if (this.props.type === "text") {
      return (
        <div className="form-group">
          <h4 htmlFor="content">Text</h4>
          <textarea
            className="form-control"
            rows="5"
            id="content"
            placeholder="What's in your mind right now?"
            onChange={this.sendTextBack}
            defaultValue={this.props.title}
          />
        </div>
      );
    } else if (this.props.type === "code") {
      // let content = `# write your JS code here`;
      // if (title !== ``) { content = '`' + title + '`'; }
      return (
        <div className="code-container">
          <div className="form-group">
            <h4 htmlFor="content">Code</h4>
            <Editor
              className="code-editor"
              value={this.state.code_data}
              // onValueChange={code => this.setState({code_data: code})}
              onValueChange={this.sendCodeBack}
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
          {/*<form onSubmit={addedAttachmentLink.bind($("input[name='Confirm']"))}>*/}
          {/*  <input type="text" className="form-control"/>*/}
          {/*  <input type="submit" id='input-link' name="Confirm"/>*/}
          {/*</form>*/}

          <input type="text" className="form-control" id="youtube-link" onChange={this.handleInputLink}/>
          <button type="submit" className='btn btn-primary btn-lg float-right input-link-button' id="youtube"
                  onClick={this.sendLinkBack}>Confirm
          </button>
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
          <input type="text" className="form-control" onChange={this.handleInputLink}/>
          <button type="submit" className='btn btn-primary btn-lg float-right input-link-button' id="image-link"
                  onClick={this.sendLinkBack}>Confirm
          </button>
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
    } else if (this.props.type === 'image_link_attach') {
      return (
        <Attachment
          key={uid(rand_string())}
          type={'image_link'}
          content={title}
        />
      );
    } else if (this.props.type === 'text_attach') {
      return (
        <Attachment
          key={uid(rand_string())}
          type={'text'}
          content={title}
          sendTextBack={this.sendTextBack}
        />
      );
    } else if (this.props.type === 'code_attach') {
      return (
        <Attachment
          key={uid(rand_string())}
          type={'code'}
          content={title}
          sendCodeBack={this.sendCodeBack}
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
              {/*<button*/}
              {/*  className="dropdown-item"*/}
              {/*  href="new_post2"*/}
              {/*  value="code"*/}
              {/*  onClick={addInput.bind(this, "code", secondary_key)}*/}
              {/*>*/}
              {/*  Code*/}
              {/*</button>*/}
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
