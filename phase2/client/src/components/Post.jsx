import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/post.scss';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';
import store from '../store';
import { loadUser } from '../actions/authActions';

class Post extends Component {
  _isMount = false;
  // Get posts likes info from server
  // code below requires server call
  state = {
    post: this.props.post,
    images: [],
    has_liked: false,
    msg: null,
  };

  componentDidMount() {
    this._isMount = true;
    axios.get(`/api/posts/${this.state.post._id}/attachments`).then(res => {
      const attachments = res.data.attachments;
      const attachment_images = attachments.filter(
        attachment => attachment.type === 'image' || attachment.type === 'image_link',
      );
      if (this._isMount) {
        this.setState({ images: attachment_images.slice(0, 5) });
      }
    });
    if (this.state.post.likes_users.includes(this.props.current_user._id)) {
      this.setState({ has_liked: true });
    }
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

  thumbup = () => {
    console.log('thumbup');
    axios
      .patch('/api/posts/like/' + this.state.post._id, {}, this.tokenConfig())
      .then(res => {
        console.log(res.data);
        if(this._isMount){
          this.setState({ post: res.data.post, has_liked: true });
        }
      })
      .catch(err => {
        console.log(err.response);
      });

    axios.patch(`/api/users/like/${this.state.post.author}`)
      .then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err)
    });

  };

  thumbdown = () => {
    console.log('thumbdown');
    axios
      .patch('/api/posts/unlike/' + this.state.post._id, {}, this.tokenConfig())
      .then(res => {
        console.log(res.data);
        if(this._isMount){
          this.setState({ post: res.data.post, has_liked: false });
        }
      })
      .catch(err => {
        console.log(err.response);
      });
    axios.patch(`/api/users/unlike/${this.state.post.author}`)
      .then(res => {
        console.log(res);
      }).catch(err => {
      console.log(err)
    });
  };

  getThumbDisplay = () => {
    return this.state.has_liked ? (
      <img
        src={'/icon/thumb_down-24px.svg'}
        alt=""
        width="40px"
        className="float-right thumb-btn"
        onClick={this.thumbClicked}
      />
    ) : (
      <img
        src={'/icon/thumb_up-24px.svg'}
        alt=""
        width="40px"
        className="float-right thumb-btn"
        onClick={this.thumbClicked}
      />
    );
  };

  render() {
    const { title, body, likes } = this.state.post;
    const { images } = this.state;
    const thumb_btn_invert_class =
      document.documentElement.getAttribute('theme') === 'dark' ? 'thumb-btn-invert' : '';
    return (
      <div className="post card">
        <div className="card-header">
          <Link
            to={{
              pathname: `/single_post/${this.props.post._id}`,
              state: {
                current_user_id: this.props.current_user._id,
              },
            }}
          >
            {/* <Link to={`/single_post/${this.props.post._id}`}> */}
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
          {this.state.msg ? (
            <div className="alert alert-danger" role="alert">
              {this.state.msg}
            </div>
          ) : null}

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
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                      <div className="modal-content">
                        <div className="modal-body">
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
            to={{
              pathname: `/single_post/${this.props.post._id}`,
              state: {
                current_user_id: this.props.current_user._id,
              },
            }}
          >
            <button className="btn btn-primary">See Details</button>
          </Link>

          <span className="likes float-right">Likes: {likes}</span>
          {/* {this.getThumbDisplay()} */}
          {this.props.current_user.admin || this.state.has_liked ? (
            <img
              src={'/icon/thumb_down-24px.svg'}
              alt=""
              width="40px"
              className={`float-right thumb-btn ${thumb_btn_invert_class}`}
              onClick={this.thumbdown}
            />
          ) : null}
          {this.props.current_user.admin || !this.state.has_liked ? (
            <img
              src={'/icon/thumb_up-24px.svg'}
              alt=""
              width="40px"
              className={`float-right thumb-btn ${thumb_btn_invert_class}`}
              onClick={this.thumbup}
            />
          ) : null}
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
  auth: state.auth,
});

export default connect(mapStateToProps)(Post);
