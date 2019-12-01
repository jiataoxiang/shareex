import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import Post from '../Post';
import store from '../../store';
import { loadUser } from '../../actions/authActions';

class FavoritesBoard extends Component {
  state = { post_ids: this.props.posts, posts: [] };
  componentDidMount() {
    this.updatePosts();
  }

  updatePosts = () => {
    const config = this.props.tokenConfig();
    config.params = { posts: this.state.post_ids };
    axios
      .get('/api/posts/post-array', config)
      .then(res => {
        console.log(res.data);
        this.setState({ posts: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  removeFav = to_be_removed_post_id => {
    console.log(to_be_removed_post_id);

    axios
      .patch(
        `/api/posts/remove-fav/${to_be_removed_post_id}`,
        {
          user_id: this.props.current_user._id,
        },
        this.props.tokenConfig(),
      )
      .then(res => {
        console.log(res.data);
        store.dispatch(loadUser()); // update current user, since updatePosts will read favs
        const posts = this.state.posts.filter(post => post._id !== to_be_removed_post_id);
        console.log(posts);
        const post_ids = this.state.post_ids.filter(id => id !== to_be_removed_post_id);
        this.setState({ post_ids, posts });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="favorite-board">
        <h3>Your Favorites</h3>
        {posts.map((post, i) => {
          return (
            <div key={post._id}>
              <Post post={post} />
              <button
                className="btn btn-danger float-right mt-2"
                value={i}
                onClick={this.removeFav.bind(this, post._id)}
              >
                Remove, {post._id}
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  tokenConfig: () => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };
    // If token, add to headers
    if (state.auth.token) {
      config.headers['x-auth-token'] = state.auth.token;
    }
    return config;
  },
});

export default connect(mapStateToProps)(withRouter(FavoritesBoard));
