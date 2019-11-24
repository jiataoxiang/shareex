import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/post.scss';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class Post extends Component {
  // Get posts likes info from server
  // code below requires server call
  state = {
    post: this.props.post,
    images: []
  };

  componentDidMount() {
    axios.get(`/api/posts/${this.state.post._id}/attachments`).then(res => {
      const attachments = res.data.attachments;
      const attachment_images = attachments.filter(
        attachment =>
          attachment.type === 'image' || attachment.type === 'image_link'
      );
      this.setState({ images: attachment_images.slice(0, 5) });
    });
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
          <Link
            to={{
              pathname: '/single_post',
              state: {
                post_id: this.props.post.id
              }
            }}
          >
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
            {images.map(image => {
              return (
                <img
                  key={uid(Math.random())}
                  src={image.body}
                  alt=""
                  className="img-thumbnail"
                />
              );
            })}
          </div>
          <hr />
          <Link
            to={{
              pathname: '/single_post',
              state: {
                post_id: this.props.post._id
              }
            }}
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
