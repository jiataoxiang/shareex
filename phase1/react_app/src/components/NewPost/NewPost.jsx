import React, {Component} from "react";
import "../../stylesheets/new_post.scss";
import AddContent from "./AddContent";
import {rand_string} from "../../lib/util";
import {uid} from "react-uid";
import $ from "jquery";


class NewPost extends Component {
  state = {
    contents: [{key: "tmp", type: undefined, title: "text"}],
    to_store: {
      title: "",
      category: "",
      content: "",
      attachments: []
    }
  };

  addedAttachmentFile = (event, secondary_key) => {
    const inputFile = event.target.files[0];
    const isJPG = inputFile.type === "image/jpeg";
    const isPNG = inputFile.type === "image/png";
    const isPDF = inputFile.type === "application/pdf";
    const attach_id = uid(rand_string());
    const file_type = isJPG || isPNG ? 'image' : 'pdf';

    if (isPDF) {
      const content = {
        key: attach_id,
        type: "pdf_attach",
        title: inputFile.name
      };
      const contents = this.state.contents;
      contents.push(content);
      this.setState({contents: contents});
    } else if (isPNG || isJPG) {
      const content = {
        key: attach_id,
        type: "image_attach",
        title: inputFile.name
      };
      const contents = this.state.contents;
      contents.push(content);
      this.setState({contents: contents});
    }
    this.state.to_store.attachments.push({
      id: attach_id,
      type: file_type,
      content: '/a_fake_path'
    });
  };

  addedAttachmentLink = (input_link, type) => {
    let link = type === 'youtube' ? input_link.replace("watch?v=", "embed/") : input_link;
    const id = uid(rand_string());
    const type_to_show = type === 'youtube' ? 'youtube_attach' : 'image_attach';
    const content = {
      key: id,
      type: type_to_show,
      title: link,
    };
    const contents = this.state.contents;
    contents.push(content);
    this.setState({contents: contents});
    this.state.to_store.attachments.push({
      id: id,
      type: type,
      content: link
    });
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

  // Update the title whenever user changes their title.
  inputTitle = (event) => {
    this.state.to_store.title = event.target.value;
    console.log(this.state.to_store.title);
  }

  inputCategory = (event) => {
    this.state.to_store.category = event.target.value;
    console.log(this.state.to_store.category);
  }

  inputContent = (event) => {
    this.state.to_store.content = event.target.value;
    console.log(this.state.to_store.content);
    // for (let i = 0; i < this.state.to_store.length; i++) {
    //   if (this.state.to_store[i].type === "content") {
    //     this.state.to_store[i].value = event.target.value;
    //     console.log("the content now is:");
    //     console.log(this.state.to_store[i].value);
    //     return;
    //   }
    // }
    // const data = {
    //   key: uid(rand_string()),
    //   type: "content",
    //   value: event.target.value,
    // };
    // const data_list = this.state.to_store;
    // data_list.push(data);
    // this.setState({to_store: data_list});
  }

  addToDatabase = (event) => {
    // TODO: add this.state.to_store to the database.
    // TODO: check if there is any empty space????
    // TODO: how to get the current author_id ???

    // generate a post id when the 'submit' button is clicked
    const post_id = uid(rand_string());
    const a_post = {
      id: post_id,
      author_id: "???",
      title: this.state.to_store.title,
      category: this.state.to_store.category,
      content: this.state.to_store.content,
      likes: 0,
      likes_user_id: [],
      attachments: this.state.to_store.attachments.map((attach)=>{return attach.id})
    }
    // now add this post to the database
    console.log(this.props.state.posts.length);
    console.log(this.props.state.posts);
    this.props.state.posts.push(a_post);
    console.log(this.props.state.posts.length);
    console.log(this.props.state.posts);
  }

  render() {
    return (
      <div className="new-post2-page">
        <div className="container">
          <h1>New Post</h1>
          <div className="secondary-container">
            <div className="form-group">
              <h4>Title</h4>
              <input type="text" className="form-control" id="tile" onChange={this.inputTitle}/>
            </div>
            <div id="contents">
              <div className="form-group">
                <h4>Category:</h4>
                <select className="form-control" id="category" onChange={this.inputCategory}>
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
                  onChange={this.inputContent}
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
          <button type="submit" className="btn btn-primary btn-lg float-right" onClick={this.addToDatabase}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default NewPost;
