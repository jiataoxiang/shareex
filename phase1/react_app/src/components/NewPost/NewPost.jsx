import React, {Component} from "react";
import "../../stylesheets/new_post.scss";
import AddContent from "./AddContent";
import {rand_string} from "../../lib/util";
import {Link, withRouter} from "react-router-dom";
import {uid} from "react-uid";


class NewPost extends Component {
  state = {
    contents: [{key: "tmp", type: undefined, title: ""}],
    to_store: {
      title: "",
      category: "",
      content: "",
      attachments: []
    }
  };

  // handle incoming image and pdf file
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
      content: process.env.PUBLIC_URL + "/files/AWS_Deploy_web_app_with_SSL.pdf"
    });
  };

  // handle incoming video/image links
  addedAttachmentLink = (input_link, type) => {
    let link = type === 'youtube' ? input_link.replace("watch?v=", "embed/") : input_link;
    const id = uid(rand_string());
    const type_to_show = type === 'youtube' ? 'youtube_attach' : 'image_link_attach';
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
    // console.log(this.state.contents);
    // console.log(this.state.to_store.attachments);
  };

  // handle incoming text/code
  addedAttachmentWords = (content, data_type, secondary_key) => {
    console.log(secondary_key);
    const result = this.alreadyExisted(secondary_key);
    const resultContent = this.alreadyExistedContents(secondary_key);
    // const type = data_type === 'code' ? 'code_attach' : 'text_attach';
    const item = {
      id: secondary_key,
      type: data_type,
      content: content
    };

    if (result === -1) {    // not yet existed in state
      this.state.to_store.attachments.push(item);
    }
    if (resultContent === -1) {
      this.state.contents.push({
        key: secondary_key,
        // TODO: changed
        type: data_type,
        title: content
      });
    } else {
      this.state.to_store.attachments.splice(result, 1, item);
      this.state.contents.splice(resultContent, 1, {
        key: secondary_key,
        // TODO: changed
        type: data_type,
        title: content
      });
    }
    console.log('length of attach is: ' + this.state.to_store.attachments.length);
    console.log(this.state.to_store.attachments);
    console.log('length of contents is: ' + this.state.contents.length);
    console.log(this.state.contents);
  };

  alreadyExisted = (secondary_key) => {
    for (let i = 0; i < this.state.to_store.attachments.length; i++) {
      if (this.state.to_store.attachments[i].id === secondary_key) {
        return i;
      }
    }
    return -1;
  };

  alreadyExistedContents = (secondary_key) => {
    for (let i = 0; i < this.state.contents.length; i++) {
      if (this.state.contents[i].key === secondary_key) {
        return i;
      }
    }
    return -1;
  };

  addInput = (type, secondary_key) => {
    for (let i = 0; i < this.state.contents.length; i++) {
      if (this.state.contents[i].key === secondary_key) {
        const content = {key: uid(rand_string()), type: type, title: '' ? type !== 'code' : ``};
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
    // console.log(this.state.to_store.category);
  };

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
  };

  // store the data in this.state.to_store to the database
  addToDatabase = (event) => {
    // generate a post id when the 'submit' button is clicked
    const post_id = uid(rand_string());
    const a_post = {
      id: post_id,
      author_id: this.props.state.current_user.id,
      title: this.state.to_store.title,
      category: this.state.to_store.category,
      content: this.state.to_store.content,
      likes: 0,
      likes_user_id: [],
      attachments: this.state.to_store.attachments.map((attach) => {
        return attach.id
      })
    };

    // now add this post to the database
    console.log(this.props.state.posts.length);
    console.log(this.props.state.posts);
    this.props.state.posts.push(a_post);
    console.log(this.props.state.posts.length);
    console.log(this.props.state.posts);

    console.log(this.props.state.attachments.length);
    console.log(this.props.state.attachments);
    this.state.to_store.attachments.map((attach) => {
      this.props.state.attachments.push({
        id: attach.id,
        post_id: post_id,
        type: attach.type,
        content: attach.content
      });
    });
    console.log(this.props.state.attachments.length);
    console.log(this.props.state.attachments);

    // redirect to home page
    alert("Sure to submit?");
    this.props.history.push("/");
  };

  componentDidMount() {
    if (!this.props.state.current_user) {
      alert("Please sign in first !");
      this.props.history.push("/");
    }
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
                    addedAttachmentWords={this.addedAttachmentWords}
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

export default withRouter(NewPost);
