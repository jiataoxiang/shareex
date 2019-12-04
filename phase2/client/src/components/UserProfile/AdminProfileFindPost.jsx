import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class AdminProfileFindPost extends React.Component {

  _isMount = false;

  state = {
    avatar: process.env.PUBLIC_URL + './img/User_Avatar.png',
    username: '',
    id: '',
    author: '',
    title: '',
    category: '',
    deleted: false,
    delete_date: -1,

    inputid: '',
  };
  // Objects that may not visible depend on the post status.
  tempElements = {
    display_post: null,
    display_delete: null,
    button_delete: null,
  };

  // Input Change handler.
  handleInputChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if (this._isMount) {
      this.setState({ [name]: value });
    }
  };

  // Show the post found.
  showPost = () => {
    this.tempElements.display_post.removeAttribute('hidden');
    if (this.state.deleted) {
      this.tempElements.display_delete.removeAttribute('hidden');
      this.tempElements.button_delete.innerHTML = 'Recover';
    } else {
      this.tempElements.display_delete.setAttribute('hidden', true);
      this.tempElements.button_delete.innerHTML = 'Delete';
    }
  };

  // Hide the post object when appropriate.
  hidePost = () => {
    this.tempElements.display_post.setAttribute('hidden', true);
  };

  // Read post from server.
  getPostInfo = e => {
    e.preventDefault();
    if (this.state.inputid.length === 0) {
      alert('Must input a id.');
    } else {
      axios
        .get(`/api/posts/${this.state.inputid}`, this.tokenConfig())
        .then(post => {
          if (!post) {
            this.hidePost();
            alert('This post does not exist.');
          } else {
            const curPost = post.data;
            if (this._isMount) {
              this.setState({
                id: curPost._id,
                author: curPost.author,
                title: curPost.title,
                category: curPost.category,
                deleted: curPost.hidden,
                delete_date: Date.parse(curPost.delete_date),
              });
            }
            this.getAuthorInfo();
          }
        })
        .catch(error => {
          this.hidePost();
          alert('Failed to get post.');
          console.log(error);
        });
    }
  };

  // Read author from server.
  getAuthorInfo = () => {
    axios
      .get(`/api/users/${this.state.author}`, this.tokenConfig())
      .then(user => {
        if (!user) {
          this.hidePost();
          alert('The author of this post no longer exists.');
        } else {
          const curUser = user.data;
          if (this._isMount) {
            this.setState({
              avatar: curUser.avatar,
              username: curUser.username,
            });
          }
          this.showPost();
        }
      })
      .catch(error => {
        this.hidePost();
        alert('Failed to get user.');
        console.log(error);
      });
  };

  // Save post status to server.
  saveChange = () => {
    if (this.state.title.length === 0) {
      alert('Title cannot be empty.');
    } else {
      axios
        .patch(
          `/api/posts/${this.state.id}`,
          {
            title: this.state.title,
            category: this.state.category,
          },
          this.tokenConfig(),
        )
        .then(post => {
          if (!post) {
            alert('Failed to update post.');
          } else {
            alert('Post saved.');

            const msgBody = 'Your post ' + this.state.title + ' is edited by an administrator';
            const newMsg = {
              from: this.props.current_user._id,
              to: this.state.author,
              body: msgBody,
              link: '/single_post/' + this.state.id,
            };
            this.sendMsg(newMsg);
          }
        })
        .catch(error => {
          alert('Failed to update post.');
          console.log(error);
        });
    }
  };

  // Delete or recover a post.
  changeDelete = () => {
    if (this.state.deleted) {
      if (this._isMount) {
        this.setState({ deleted: false });
      }
      this.tempElements.display_delete.setAttribute('hidden', true);
      this.tempElements.button_delete.innerHTML = 'Delete';

      const msgBody = 'Your post <<' + this.state.title + '>> is recovered by an administrator';
      const newMsg = {
        from: this.props.current_user._id,
        to: this.state.author,
        body: msgBody,
        link: '/single_post/' + this.state.id,
      };
      this.sendMsg(newMsg);
    } else {
      if (this._isMount) {
        this.setState({ deleted: true });
      }
      this.tempElements.display_delete.removeAttribute('hidden');
      this.tempElements.button_delete.innerHTML = 'Recover';

      const msgBody = 'Your post <<' + this.state.title + '>> is deleted by an administrator';
      const newMsg = {
        from: this.props.current_user._id,
        to: this.state.author,
        body: msgBody,
      };
      this.sendMsg(newMsg);
    }
  };

  // Change the deleted status on the server.
  changeDeleteToServer = () => {
    axios
      .patch(
        `/api/posts/delete/${this.state.id}`,
        {
          hidden: !this.state.deleted,
          delete_date: Date.now(),
        },
        this.tokenConfig(),
      )
      .then(result => {
        if (result) {
          if (this._isMount) {
            this.setState({ delete_date: Date.now() });
          }
          this.changeDelete();
        } else {
          alert('Failed to delete the post.');
        }
      })
      .catch(err => {
        alert('Failed to delete the post.');
        console.log(err);
      });
  };

  // Send a notification to server.
  sendMsg = msg => {
    axios
      .post(`/api/notifications/create`, msg, this.tokenConfig())
      .then(msg => {
        if (!msg) {
          alert('Failed to notify the user.');
        } else {
          alert('Notified the user.');
        }
      })
      .catch(err => {
        alert('Failed to notify the user.');
        console.log(err);
      });
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

  componentDidMount() {
    this._isMount = true;
    this.tempElements.display_post = document.getElementById('display-post');
    this.tempElements.display_post.setAttribute('hidden', true);

    this.tempElements.display_delete = document.getElementById('delete-warning');
    this.tempElements.display_delete.setAttribute('hidden', true);

    this.tempElements.button_delete = document.getElementById('button-delete');
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    return (
      <div id="findpost">
        <form id="search-post">
          <p>Find post by id:</p>
          <input
            type="text"
            id="post-id-input"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            name="inputid"
            value={this.state.inputid}
            onChange={this.handleInputChange}
          />
          <button type="submit" className="btn btn-primary ml-2" onClick={this.getPostInfo}>
            Find
          </button>
        </form>

        <div id="display-post">
          <div className="row row-info">
            <div className="col-md-6">
              <div className="row">
                <div className="col-md avatar-container">
                  <Link to={`/otherprofile/${this.state.author}`}>
                    <img id="user-avatar" src={this.state.avatar} alt="" />
                  </Link>
                  <h6>{this.state.username}</h6>
                </div>
                <div id="text-block" className="col-md-8">
                  <div>
                    <p className="prop-pre">Title:</p>
                    <input
                      type="text"
                      id="title-input"
                      aria-label="Sizing example input"
                      aria-describedby="inputGroup-sizing-default"
                      name="title"
                      value={this.state.title}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="categroy">
                    <p className="prop-pre">Category:</p>
                    <select
                      id="category-selection"
                      name="category"
                      value={this.state.category}
                      onChange={this.handleInputChange}
                    >
                      <option value="CS">Computer Science</option>
                      <option value="Education">Travel</option>
                      <option value="Travel">Education</option>
                      <option value="Technology">Cooking</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div id="delete-warning">
                    <h6>
                        Deleted{' '}
                        {Math.floor((Date.now() - this.state.delete_date) / (1000 * 60 * 60 * 24))} days ago.
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 edit-post-buttons">
              <button className="btn btn-success btn-block" 
                onClick={this.saveChange}
              >
                Save Changes
              </button>
              <button
                type="button"
                id="button-delete"
                className="btn btn-danger btn-block"
                onClick={this.changeDeleteToServer}
              >
                Delete
              </button>
            </div>
          </div>
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

export default connect(mapStateToProps)(AdminProfileFindPost);
