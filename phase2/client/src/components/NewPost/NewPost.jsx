import React, { Component } from 'react';
import '../../stylesheets/new_post.scss';
import AddContent from './AddContent';
import { rand_string } from '../../lib/util';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { uid } from 'react-uid';
import axios from 'axios';
import { login } from '../../actions/authActions';

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // edit_mode: false,
      contents: [{ key: uid(rand_string()), parent_key: '', type: undefined, title: '' }],
      to_store: {
        title: '',
        category: 'Computer Science',
        content: '',
      },
    };
  }

  componentDidMount() {
    this.loadPrevData();
  }

  loadPrevData = () => {
    console.log('run!!');
    console.log('Before set mode: ', this.state.edit_mode);
    console.log(this.props.location.state);
    if (this.props.location.state) {
      console.log('Current old attaches are: ', this.props.location.state.attachments);
      console.log('start loading prev data!');
      // set content lists, all attachments
      this.setState({ edit_mode: true });
      let org_attach = [];
      this.props.location.state.attachments.forEach(e => {
        let type_to_show;
        if (e.type === 'show-text') {
          type_to_show = 'text';
        } else {
          type_to_show = e.type + '_attach';
        }
        const key = uid(rand_string());
        this.state.contents.push({
          key: key,
          parent_key: key,
          type: type_to_show,
          title: e.body,
        });
        org_attach.push({
          _id: e._id,
        });
      });
      this.setState({ original_attachments: org_attach });

      // set title, category, content
      const cur_post = this.props.location.state.post;

      const property = this.state.to_store;
      property.title = cur_post.title;
      this.setState({ property });

      const property2 = this.state.to_store;
      property2.category = cur_post.category;
      this.setState({ property2 });
      this.setFrontEndCategory(cur_post.category);

      const property3 = this.state.to_store;
      property3.content = cur_post.body;
      this.setState({ property3 });
      console.log(this.state);
    }
  };

  setFrontEndCategory = category => {
    const id_name = category === 'Computer Science' ? 'CS-option' : category + '-option';
    document.getElementById(id_name).selected = true;
  };

  // find the correct position to insert new item
  findInsertPosContent = key => {
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
    this.setState({ contents: contents });
  };

  // handle incoming video/image links and store them in state
  addedAttachmentLink = (input_link, type, parent_key, secondary_key) => {
    let link = type === 'youtube' ? input_link.replace('watch?v=', 'embed/') : input_link;
    const type_to_show = type === 'youtube' ? 'youtube_attach' : 'image_link_attach';
    // find the correct position in content to insert
    const pos_content = this.findInsertPosContent(secondary_key);

    // insert the item into the content list.
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
    this.setState({ contents: contents });
  };

  // handle incoming text/code and store them in state
  addedAttachmentWords = (content, data_type, parent_key, secondary_key) => {
    // content
    const resultContent = this.alreadyExistedContents(secondary_key);
    this.state.contents.splice(resultContent, 1, {
      key: secondary_key,
      parent_key: parent_key,
      type: data_type,
      title: content,
    });
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
          title: '' ? type !== 'code' : ``,
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

  // delete an specified item from current post
  deleteItem = secondary_key => {
    for (let i = 0; i < this.state.contents.length; i++) {
      if (this.state.contents[i].key === secondary_key) {
        const contents = this.state.contents;
        contents.splice(i, 1);
        this.setState({ contents: contents });
      }
    }
  };

  // Update the title whenever user changes their title.
  inputTitle = event => {
    const property = this.state.to_store;
    property.title = event.target.value;
    this.setState({ property });
  };

  // Update the category whenever user changes their title.
  inputCategory = event => {
    const property = this.state.to_store;
    property.category = event.target.value;
    this.setState({ property });
  };

  // Update the content whenever user changes their title.
  inputContent = event => {
    const property = this.state.to_store;
    property.content = event.target.value;
    this.setState({ property });
  };

  // configure the token used for authentication
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
  addToDatabase = () => {
    // generate a post id when the 'submit' button is clicked
    if (this.state.to_store.title === '' || this.state.to_store.content === '') {
      alert('Please fill in blank (Title/Content) field.');
    } else {
      alert('Sure to submit?');

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
        // original_attachments: this.state.original_attachments,
      };
      if (!this.state.edit_mode) {
        axios
          .post('/api/posts', a_post, this.tokenConfig())
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // delete all the old attachments
        this.state.original_attachments.forEach(e => {
          axios
            .delete('/api/attachments/' + e._id, this.tokenConfig())
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        });

        axios
          .patch(
            '/api/posts/update-post/' + this.props.location.state.post._id,
            a_post,
            this.tokenConfig(),
          )
          .then(res => {
            console.log('Updated post: ', res);
          })
          .catch(err => {
            console.log(err);
          });
      }

      // redirect to home page
      this.props.history.push('/');
    }
  };

  render() {
    if (!this.props.isAuthenticated) this.props.history.push('/');

    return (
      <div className="new-post-page">
        <div className="container-fluid">
          {this.state.edit_mode ? <h1>Edit Post</h1> : <h1>New Post</h1>}
          <div className="secondary-container">
            <div className="form-group">
              <h4>Title</h4>
              <input
                type="text"
                className="form-control"
                id="tile"
                defaultValue={this.state.to_store.title}
                onChange={this.inputTitle}
              />
            </div>
            <div id="contents">
              <div className="form-group">
                <h4>Category:</h4>
                <select
                  className="form-control"
                  id="category"
                  defaultValue={this.state.to_store.category}
                  onChange={this.inputCategory}
                >
                  <option id="CS-option">Computer Science</option>
                  <option id="Travel-option">Travel</option>
                  <option id="Education-option">Education</option>
                  <option id="Technology-option">Technology</option>
                  <option id="Cooking-option">Cooking</option>
                  <option id="Other-option">Other</option>
                </select>
              </div>
              <div className="form-group">
                <h4 htmlFor="content">Content</h4>
                <textarea
                  className="form-control"
                  rows="5"
                  id="content"
                  placeholder="What's in your mind right now?"
                  defaultValue={this.state.to_store.content}
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
