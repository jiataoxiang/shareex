import React, {Component} from 'react';
import '../../stylesheets/new_post.scss';
import AddContent from './AddContent';
import {rand_string} from '../../lib/util';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {uid} from 'react-uid';
import axios from 'axios';

class NewPost extends Component {
  state = {
    contents: [{key: uid(rand_string()), parent_key: '', type: undefined, title: ''}],
    to_store: {
      title: '',
      category: '',
      content: 'a'
    },
    attachments: [],
  };

  findInsertPosAttach = (sec_key) => {
    const list = this.state.attachments;
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === sec_key) {
        let j;
        for (j = i + 1; j < list.length; j++) {
          if (list[j].parent_key !== sec_key) {
            return j;
          }
        }
        // means this is a sec_key that should be appended to the end of the array.
        return j;
      }
    }
    // means this is a new sec_key, and need to append to the end of the array.
    return -1;
  };

  findInsertPosContent = (key) => {
    const list = this.state.contents;
    for (let i = 0; i < list.length; i++) {
      if (list[i].key === key) {
        return i;
      }
    }
  };

  // handle incoming image and pdf file, and store them in state
  addedAttachmentFile = (type, data_url, secondary_key) => {
    const type_to_show = type === 'image' ? 'image_attach' : 'pdf_attach';
    // find the correct position in content to insert
    const pos_content = this.findInsertPosContent(secondary_key);
    // const pos_attach = this.findInsertPosAttach(secondary_key);
    console.log('pdf link is: ', data_url);

    // insert the item into the content list.
    const content = {
      // key: secondary_key,
      key: uid(rand_string()),
      parent_key: secondary_key,
      type: type_to_show,
      title: data_url,
    };
    const contents = this.state.contents;
    if (pos_content === -1) {
      contents.push(content);
    } else {
      contents.splice(pos_content + 1, 0, content);
    }
    this.setState({contents: contents});

    // insert the item into the attach list.
    // const attach = {key: secondary_key, type: type, body: data_url};
    // const attachments = this.state.attachments;
    // if (pos_attach === -1) {
    //   attachments.push(attach);
    // } else {
    //   attachments.splice(pos_attach, 0, attach);
    // }
    // this.setState({attachments: attachments});
    // console.log('Now attachments have: ', this.state.to_store.attachments);
  };

  // handle incoming video/image links and store them in state
  addedAttachmentLink = (input_link, type, parent_key, secondary_key) => {
    let link = type === 'youtube' ? input_link.replace('watch?v=', 'embed/') : input_link;
    const type_to_show = type === 'youtube' ? 'youtube_attach' : 'image_link_attach';
    // find the correct position in content to insert
    const pos_content = this.findInsertPosContent(secondary_key);
    const pos_attach = this.findInsertPosAttach(secondary_key);

    // insert the item into the content list.
    console.log("The content list is: ", this.state.contents);
    console.log("The attach list is: ", this.state.attachments);
    console.log("The sec key is: ", secondary_key);
    console.log("The index found is: ", pos_content);
    const content = {
      key: uid(rand_string()),
      parent_key: secondary_key,
      type: type_to_show,
      title: link,
    };
    const contents = this.state.contents;
    if (pos_content === this.state.contents.length - 1) {
      contents.push(content);
    } else {
      contents.splice(pos_content + 1, 0, content);
    }
    this.setState({contents: contents});

    // insert the item into the attach list.
    const attach = {
      key: uid(rand_string()),
      parent_key: secondary_key,
      type: type,
      body: link,
    };
    const attachments = this.state.attachments;
    if (pos_attach === -1 || pos_attach === this.state.attachments.length - 1) {
      attachments.push(attach);
    } else {
      attachments.splice(pos_attach, 0, attach);
    }
    this.setState({attachments: attachments});
  };

  // handle incoming text/code and store them in state
  addedAttachmentWords = (content, data_type, parent_key, secondary_key) => {
    // attach
    const item = {
      key: parent_key,
      type: 'show-' + data_type,
      body: content,
    };
    const result = this.alreadyExisted(parent_key);
    if (result === -1) {
      this.state.attachments.push(item);
    } else {
      this.state.attachments.splice(result, 1, item);
    }

    // content
    const resultContent = this.alreadyExistedContents(secondary_key);
    this.state.contents.splice(resultContent, 1, {
      key: secondary_key,
      parent_key: parent_key,
      type: data_type,
      title: content,
    });
  };

  // check if a element already in this.state.to_store.attachments
  alreadyExisted = secondary_key => {
    for (let i = 0; i < this.state.attachments.length; i++) {
      if (this.state.attachments[i].key === secondary_key) {
        return i;
      }
    }
    return -1;
  };

  // check if a element already in this.state.contents
  alreadyExistedContents = secondary_key => {
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
        const content = {
          key: uid(rand_string()),
          parent_key: secondary_key,
          type: type,
          title: '' ? type !== 'code' : ``
        };
        const content_list = this.state.contents;
        content_list.splice(i + 1, 0, content);
        this.setState({
          contents: content_list,
        });
        break;
      }
    }
  };

  deleteItem = (secondary_key) => {
    for (let i = 0; i < this.state.contents.length; i++) {
      if (this.state.contents[i].key === secondary_key) {
        const contents = this.state.contents;
        console.log("Item deleted!", contents[i]);
        console.log("length of content list: before ", contents.length);
        contents.splice(i, 1);
        console.log("length of content list: after ", contents.length);
        this.setState({contents: contents});
      }
    }
  };

  // Update the title whenever user changes their title.
  inputTitle = event => {
    const property = this.state.to_store;
    property.title = event.target.value;
    this.setState({property});
  };

  // Update the category whenever user changes their title.
  inputCategory = event => {
    const property = this.state.to_store;
    property.category = event.target.value;
    this.setState({property});
  };

  // Update the content whenever user changes their title.
  inputContent = event => {
    const property = this.state.to_store;
    property.content = event.target.value;
    this.setState({property});
  };

  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

    // Headers
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
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
  addToDatabase = event => {
    // generate a post id when the 'submit' button is clicked
    alert('Sure to submit?');
    // const re_sort_attach = this.state.attachments.reverse();
    const re_sort_attach = [];
    this.state.contents.slice(1, this.state.contents.length).forEach(item => {
      if (item.type === 'text') {
        item.type = 'show-text';
        item.body = item.title;
        re_sort_attach.push(item);
      }
      const array = item.type.split('_');
      if (array[array.length - 1] === 'attach') {
        // youtube_attach, image_link_attach, pdf_attach, image_attach, text
        const sliced = array.slice(0, array.length - 1);
        item.type = sliced.join('_');
        item.body = item.title;
        re_sort_attach.push(item);
      }
    });

    const a_post = {
      author: this.props.current_user._id,
      title: this.state.to_store.title,
      category: this.state.to_store.category,
      body: this.state.to_store.content,
      attachments: re_sort_attach.reverse(),
    };
    // console.log('These are attachments:....', this.state.to_store.attachments);
    axios
      .post('/api/posts', a_post, this.tokenConfig())
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    // redirect to home page
    this.props.history.push('/');
  };

  render() {
    return (
      <div className="new-post-page">
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
                  <option>Computer Science</option>
                  <option>Travel</option>
                  <option>Education</option>
                  <option>Technology</option>
                  <option>Cooking</option>
                  <option>Other</option>
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
                    parent_key={content.parent_key}
                    title={content.title}
                    type={content.type}
                    addInput={this.addInput}
                    deleteItem={this.deleteItem}
                    addedAttachmentFile={this.addedAttachmentFile}
                    addedAttachmentLink={this.addedAttachmentLink}
                    addedAttachmentWords={this.addedAttachmentWords}
                  />
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg float-right"
            onClick={this.addToDatabase}
          >
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
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(NewPost));
