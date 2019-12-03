import Post from '../Post';
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class PostsBoard extends React.Component {

  _isMount = false;
  state = {
    author: this.props.author,
    posts: [],
  };

  componentDidMount() {
    this._isMount = true;
    this.updatePosts();
  }

  updatePosts = () => {
    axios
      .get('/api/posts/by-user/' + this.state.author, this.props.tokenConfig())
      .then(res => {
        if(this._isMount){
          this.setState({ posts: res.data.posts });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    const posts = this.state.posts;
    return (
      <div className="post-board">
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <h4 className="text-center">You have no post.</h4>
        ) : (
          posts.map(post => {
            return <Post key={uid(Math.random())} post={post} />;
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

export default connect(mapStateToProps)(PostsBoard);
