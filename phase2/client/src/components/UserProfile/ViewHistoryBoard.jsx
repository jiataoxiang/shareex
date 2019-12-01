import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import Post from '../Post';
import store from '../../store';
import { loadUser } from '../../actions/authActions';

class ViewHistoryBoard extends Component {
  state = { post_ids: this.props.posts ? this.props.posts : [], posts: [] };

  componentDidMount() {
    store.dispatch(loadUser());
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

  removeHistory = () => {
    axios
      .patch(
        `/api/users/${this.props.current_user._id}/remove-view-history`,
        {},
        this.props.tokenConfig(),
      )
      .then(res => {
        console.log(res.data.message);
        console.log(res.data.user_view_history);
        store.dispatch(loadUser()).then(() => {
          this.setState({ post_ids: [], posts: [] });
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="view-history-board">
        <div className="row">
          <div className="col">
            <h3>Your View History</h3>
          </div>
          <div className="col">
            <button
              className="btn btn-danger btn-sm float-right btn-remove"
              onClick={this.removeHistory}
            >
              Remove All View History
            </button>
          </div>
        </div>

        {posts.length === 0 ? (
          <h4 className="text-center">You Don't Have Any View History</h4>
        ) : (
          posts.map((post, i) => {
            return (
              <div key={post._id}>
                <Post post={post} />
              </div>
            );
          })
        )}
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

export default connect(mapStateToProps)(ViewHistoryBoard);
