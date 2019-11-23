import React, { Component } from 'react';
import Post from '../Post';
import { Link } from 'react-router-dom';
import '../../stylesheets/home.scss';
import { rand_string } from '../../lib/util';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import axios from 'axios';

class Home extends Component {
  state = {
    posts: [],
    recommendations: [],
    mounted: true
  };

  componentDidMount() {
    this.setState({ mounted: true });
    this.updatePosts();
  }
  componentDidUpdate() {
    // this.updatePosts();
  }
  // the following code is for getting all posts to be displayed on home page
  updatePosts = () => {
    if (this.state.mounted) {
      axios
        .get('/api/posts')
        .then(res => {
          this.setState({ posts: res.data.posts });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

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

  /* Recommendations are selected as those posts with more than 10 likes
    Only at most 10 are selected randomly */
  // getRecommendations() returns the recommendations to be displayed on home page
  getRecommendations = () => {
    // Get posts from server
    // code below requires server call
    let posts = this.props.state.posts;
    const recommendations = [];
    let count = 0;
    if (posts) {
      posts = posts.filter(post => post.likes >= 10);
      for (let i = 0; i < posts.length && count < 10; i++) {
        if (posts[i].likes >= 10) {
          recommendations.push(posts[i]);
        }
      }
    }
    return recommendations;
  };

  render() {
    const posts = this.state.posts;
    return (
      <div className="home-page">
        <div className="container row">
          <div className="posts col-12 col-md-8">
            <h3>Posts</h3>
            {posts.map(post => {
              return <Post key={uid(Math.random())} post={post} />;
            })}
          </div>
          <div className="recommendations col-12 col-6 col-md-4">
            <div className="sticky-top">
              <h3>Recommendations</h3>
              <ul className="list-group">
                {/* {this.getRecommendations().map(recommendation => {
                  return (
                    <li key={uid(rand_string())} className="list-group-item">
                      <Link
                        to={{
                          pathname: '/single_post',
                          state: {
                            post_id: recommendation.id
                          }
                        }}
                      >
                        {recommendation.title}
                      </Link>
                    </li>
                  );
                })} */}
              </ul>
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
  auth: state.auth
});

export default connect(mapStateToProps)(Home);
