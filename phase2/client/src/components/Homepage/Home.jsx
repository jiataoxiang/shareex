import React, { Component } from 'react';
import Post from '../Post';
import '../../stylesheets/home.scss';
// import { rand_string } from '../../lib/util';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { uid } from 'react-uid';
import axios from 'axios';

class Home extends Component {
  state = {
    posts: [],
    recommendations: []
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
      return;
    }
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.search_content
    ) {
      this.search(this.props.location.state.search_content);
    }
    this.updatePosts();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location &&
      nextProps.location.state &&
      nextProps.location.state.search_content
    ) {
      this.search(nextProps.location.state.search_content);
    }
  }

  search = search_content => {
    axios
      .get(`/api/posts/search/${search_content}`)
      .then(res => {
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  updatePosts = (category, sort_by) => {
    if (!sort_by) sort_by = 'created_at';
    axios
      .get('/api/posts', {
        params: {
          sort_by,
          category
        }
      })
      .then(res => {
        this.setState({ posts: res.data.posts });
      })
      .catch(error => {
        console.log(error);
      });
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

  applyFilters = () => {
    let category = document.getElementById('category-selection').value;
    if (category === 'All') category = undefined;
    const sort_by = document.getElementById('sort-selection').value;
    this.updatePosts(category, sort_by);
  };

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    const posts = this.state.posts;
    return (
      <div className="home-page">
        <div className="container row">
          <div className="posts col-12 col-md-8">
            <div className="row">
              <div className="col-2">
                <h3>Posts</h3>
              </div>
              <div className="col-10">
                <span className="float-right">
                  <span className="ml-3"> Sort By:</span>
                  <select id="category-selection" name="category">
                    <option value="All">All</option>
                    <option value="CS">CS</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Technology">Technology</option>
                    <option value="Following">Following</option>
                  </select>

                  <span className="ml-3"> Sort By:</span>
                  <select id="sort-selection" name="sort_by">
                    <option value="created_at">Time</option>
                    <option value="views">Views</option>
                    <option value="likes">Likes</option>
                    <option value="favs"># of Favourite</option>
                  </select>
                  <button
                    className="ml-3 btn btn-sm btn-outline-success"
                    onClick={this.applyFilters}
                  >
                    Confirm
                  </button>
                </span>
              </div>
            </div>
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

export default connect(mapStateToProps)(withRouter(Home));
