import React, {Component} from "react";
import "../../stylesheets/new_post.scss";
import AddContent from "./AddContent";
import {rand_string} from "../../lib/util";
import {uid} from "react-uid";

class NewPost extends Component {
  state = {
    contents: [{key: "key_tmp", type: undefined, title: "test"}]
  };

  addedAttachmentFile = (event, secondary_key) => {
    const inputFile = event.target.files[0]
    const isJPG = inputFile.type === 'image/jpeg';
    const isPNG = inputFile.type === 'image/png';
    const isPDF = inputFile.type === 'application/pdf';
    console.log(inputFile);
    console.log(inputFile.type);
    console.log(inputFile.name);
    if(isPDF){
      const content = {key: uid(rand_string()), type: 'pdf_attach', title: inputFile.name};
      const contents = this.state.contents;
      contents.push(content);
      this.setState({contents: contents});
    }
    else if(isPNG || isJPG){
      const content = {key: uid(rand_string()), type: 'image_attach', title: inputFile.name};
      const contents = this.state.contents;
      contents.push(content);
      this.setState({contents: contents});
    }
  }

  // Generic handler for whenever we type in an input box.
  // We change the state for the particular property bound to the textbox from the event.
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // 'this' is bound to the component in this arrow function.
    this.setState({
      [name]: value // [name] sets the object property name to the value of the 'name' variable.
    });
  };

  addInput = (type, secondary_key) => {
    for (let i = 0; i < this.state.contents.length; i++) {
      if (this.state.contents[i].key === secondary_key) {
        const content = {key: uid(rand_string()), type: type, title: type};
        const content_list = this.state.contents;
        content_list.splice(i + 1, 0, content);
        this.setState({
          contents: content_list
        });
        break;
      }
    }
  };

  render() {
    return (
      <div className="new-post2-page">
        <div className="container">
          <h1>New Post</h1>
          <div className="secondary-container">
            <div className="form-group">
              <h4>Title</h4>
              <input type="text" className="form-control" id="tile"/>
            </div>
            <div id="contents">
              <div className="form-group">
                <h4>Category:</h4>
                <select className="form-control" id="category">
                  <option>Travel</option>
                  <option>Education</option>
                  <option>Computer Science</option>
                  <option>Technology</option>
                </select>
              </div>
              <div className="form-group">
                <h4 htmlFor="content">Content</h4>
                <textarea
                  className="form-control"
                  rows="5"
                  id="content"
                  placeholder="What's in your mind right now?"
                />
              </div>

              {this.state.contents.map(content => {
                return (
                  <AddContent
                    key={uid(rand_string())}
                    secondary_key={content.key}
                    title={content.title}
                    type={content.type}
                    addInput={this.addInput}
                    addedAttachmentFile={this.addedAttachmentFile}
                  />
                );
              })}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-lg float-right">
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default NewPost;
