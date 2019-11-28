import React, {Component} from "react";
import "../../stylesheets/new_post.scss";
import AddContent from "./AddContent";
import {rand_string} from "../../lib/util";
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {uid} from "react-uid";
import axios from "axios";


class NewPost extends Component {
  // TODO: connect to server, and fetch the data we need. Then, store them in the state.
  state = {
    contents: [{key: "tmp", type: undefined, title: ""}],
    to_store: {
      title: "",
      category: "",
      content: "",
      attachments: []
    }
  };

  // handle incoming image and pdf file, and store them in state
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
      body: file_type === 'pdf' ? process.env.PUBLIC_URL + "/files/AWS_Deploy_web_app_with_SSL.pdf" : process.env.PUBLIC_URL + "/img/logo192.png"
    });
  };

  // handle incoming video/image links and store them in state
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
      body: link
    });
    // console.log(this.state.contents);
    // console.log(this.state.to_store.attachments);
  };

  // handle incoming text/code and store them in state
  addedAttachmentWords = (content, data_type, secondary_key) => {
    const result = this.alreadyExisted(secondary_key);
    const resultContent = this.alreadyExistedContents(secondary_key);
    const item = {
      id: secondary_key,
      type: 'show-'+data_type,
      body: content
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
    // console.log('length of attach is: ' + this.state.to_store.attachments.length);
    // console.log(this.state.to_store.attachments);
    // console.log('length of contents is: ' + this.state.contents.length);
    // console.log(this.state.contents);
  };

  // check if a element already in this.state.to_store.attachments
  alreadyExisted = (secondary_key) => {
    for (let i = 0; i < this.state.to_store.attachments.length; i++) {
      if (this.state.to_store.attachments[i].id === secondary_key) {
        return i;
      }
    }
    return -1;
  };

  // check if a element already in this.state.contents
  alreadyExistedContents = (secondary_key) => {
    for (let i = 0; i < this.state.contents.length; i++) {
      if (this.state.contents[i].key === secondary_key) {
        return i;
      }
    }
    return -1;
  };

  // add corresponding input box selected from dropdown menu
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
    const property = this.state.to_store;
    property.title = event.target.value;
    this.setState({property});

    // this.state.to_store.title = event.target.value;
    // console.log(this.state.to_store.title);
  };

  // Update the category whenever user changes their title.
  inputCategory = (event) => {
    const property = this.state.to_store;
    property.category = event.target.value;
    this.setState({property});

    // this.state.to_store.category = event.target.value;
    // console.log(this.state.to_store.category);
  };

  // Update the content whenever user changes their title.
  inputContent = (event) => {
    const property = this.state.to_store;
    property.content = event.target.value;
    this.setState({property});

    // this.state.to_store.content = event.target.value;
    // console.log(this.state.to_store.content);
  };

  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

    // Headers
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    };

    // If token, add to headers
    if (token) {
      config.headers['x-auth-token'] = token;
    } else {
      window.location.href = '/';
    }

    return config;
  };

  // store the data in this.state.to_store to the database
  addToDatabase = (event) => {
    // TODO: connect server here. Then we will send data in state to the server.
    // generate a post id when the 'submit' button is clicked
    alert("Sure to submit?");
    // const post_id = uid(rand_string());
    // console.log(this.state.current_user);
    const re_sort_attach = this.state.to_store.attachments.reverse();
    const a_post = {
      // id: post_id,
      author: this.props.current_user._id,
      title: this.state.to_store.title,
      category: this.state.to_store.category,
      body: this.state.to_store.content,
      attachments: re_sort_attach
    };
    console.log("These are attachments:....", this.state.to_store.attachments);

    axios.post('/api/posts', a_post, this.tokenConfig())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // redirect to home page
    this.props.history.push("/");
  };

  // check if the user has signed in
  // componentDidMount() {
  //   if (!this.props.state.current_user) {
  //     alert("Please sign in first !");
  //     this.props.history.push("/");
  //   }
  // }

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

// getting from reducers (error and auth reducers)
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(NewPost));
