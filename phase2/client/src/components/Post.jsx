import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/post.scss';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class Post extends Component {
  _isMount = false;
  // Get posts likes info from server
  // code below requires server call
  state = {
    post: this.props.post,
    images: []
  };

  componentDidMount() {
    this._isMount = true;
    axios.get(`/api/posts/${this.state.post._id}/attachments`).then(res => {
      const attachments = res.data.attachments;
      const attachment_images = attachments.filter(
        attachment =>
          attachment.type === 'image' || attachment.type === 'image_link'
      );
      if (this._isMount) {
        this.setState({ images: attachment_images.slice(0, 5) });
      }
    });
  }

  componentWillUnmount() {
    this._isMount = false;
  }

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

  thumbClicked = () => {
    axios
      .patch('/api/posts/like/' + this.state.post._id, {}, this.tokenConfig())
      .then(res => {
        console.log(res.data);
        this.setState({ post: res.data.post });
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  render() {
    const { title, body, likes } = this.state.post;
    const { images } = this.state;
    return (
      <div className="post card">
        <div className="card-header">
          <Link to={`/single_post/${this.props.post._id}`}>
            {/* style={{ display: 'inline-block' }} */}
            <span>
              <h5 className="post-title">{title}</h5>
            </span>
          </Link>
          {this.props.isAuthenticated && this.props.current_user.admin ? (
            <span className="float-right">Post id: {this.props.post._id}</span>
          ) : null}
        </div>

        <div className="card-body">
          {/* <h5 className="card-title">Special title treatment</h5> */}
          <p className="card-text">{body}</p>
          <div className="row">
            {images.map((image, i) => {
              const id = uid(Math.random());
              return (
                <div key={id}>
                  <img
                    src={image.body}
                    alt=""
                    className="img-thumbnail"
                    data-toggle="modal"
                    data-target={'#example34' + this.props.post._id + i}
                  />
                  <div
                    className="modal fade"
                    id={'example34' + this.props.post._id + i}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div
                      className="modal-dialog modal-lg modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content">
                        <div className="modal-body">
                          {/* {image.body} */}
                          <img
                            src={image.body}
                            alt=""
                            // className="img-thumbnail"
                            data-toggle="modal"
                            data-target="#exampleModal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <hr />
          <Link
            to={`/single_post/${this.props.post._id}`}
            className="btn btn-primary"
          >
            See Details
          </Link>

          <span className="likes float-right">Likes: {likes}</span>
          {/* Thumb up button */}
          <img
            src={'./img/thumb_up.png'}
            alt=""
            width="40px"
            className="float-right thumb-up-btn"
            onClick={this.thumbClicked}
          />
          {/* The code below is also a thumb up button, it's from font awesome */}
          {/* <i class="fas fa-thumbs-up float-right"></i> */}
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

export default connect(mapStateToProps)(Post);
