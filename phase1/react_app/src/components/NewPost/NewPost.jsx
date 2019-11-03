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
    const inputFile = event.target.files[0];
    const isJPG = inputFile.type === "image/jpeg";
    const isPNG = inputFile.type === "image/png";
    const isPDF = inputFile.type === "application/pdf";

    // const reader = new FileReader();
    // // const url = reader.readAsDataURL(inputFile);
    // reader.onload = function(e) {
    //   let dataURL = reader.result;
    //   console.log(dataURL);
    //   console.log("+++++++++++++++++++++++++++-_______________________");
    // }
    // const the_url = reader.readAsDataURL(inputFile);
    // console.log(the_url);
    // console.log("++++++++");
    // console.log(event.target.files);
    // console.log(inputFile.type);
    // console.log(inputFile.name);
    if (isPDF) {
      const content = {
        key: uid(rand_string()),
        type: "pdf_attach",
        title: inputFile.name
      };
      const contents = this.state.contents;
      contents.push(content);
      this.setState({contents: contents});
    } else if (isPNG || isJPG) {
      const content = {
        key: uid(rand_string()),
        type: "image_attach",
        title: inputFile.name
      };
      const contents = this.state.contents;
      contents.push(content);
      this.setState({contents: contents});
    }
  };

  addedAttachmentLink = (event) => {
    console.log(event.target.value);
    let link = event.target.value.replace("watch?v=", "embed/");
    console.log(link);
    const content = {
      key: uid(rand_string()),
      type: "youtube_attach",
      title: link,
    };
    const contents = this.state.contents;
    contents.push(content);
    this.setState({contents: contents});
  }

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
                    addedAttachmentLink={this.addedAttachmentLink}
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
