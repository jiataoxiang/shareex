import Post from "../Post";
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class PostsBoard extends React.Component {
  state = {
    author: this.props.author,
    posts: []
  };

  componentDidMount() {
    this.updatePosts()
  }

  updatePosts = () => {
    console.log('updating posts');
    axios
      .get(
        '/api/posts/by-user/' + this.state.author,
        this.props.tokenConfig()
      )
      .then(res => {
        console.log(res.data);
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
          <h3>Posts</h3>
          {this.state.posts.map(post => {
            return <Post key={uid(Math.random())} post={post} />;
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
        'Content-type': 'application/json'
      }
    };
    // If token, add to headers
    if (state.auth.token) {
      config.headers['x-auth-token'] = state.auth.token;
    }
    return config;
  }
});

export default connect(mapStateToProps)(PostsBoard);