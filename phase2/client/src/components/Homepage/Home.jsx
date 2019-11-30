import React, { Component } from 'react';
import Post from '../Post';
import '../../stylesheets/home.scss';
// import { rand_string } from '../../lib/util';
import { Redirect, Link } from 'react-router-dom';
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
    console.log('Home did mount');
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
      return;
    }
    if (this.props.location && this.props.location.state) {
      if (this.props.location.state.search_content) {
        this.search(this.props.location.state.search_content);
      } else if (this.props.location.state.search_content === '') {
        console.log('debug');
        this.search();
      }
    }
    this.updatePosts();
    this.updateRecommendations();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location && nextProps.location.state) {
      if (nextProps.location.state.search_content) {
        this.search(nextProps.location.state.search_content);
      } else if (nextProps.location.state.search_content === '') {
        console.log('componentWillReceiveProps debug');
        this.search();
      }
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
    const search_content = document.getElementById('search-bar').value;
    console.log('search: ', search_content);
    if (!sort_by) sort_by = 'created_at';
    axios
      .get('/api/posts', {
        params: {
          sort_by,
          category,
          search_content
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
  updateRecommendations = () => {
    axios
      .get('/api/posts/recommendations')
      .then(res => {
        const recommendations = res.data;
        console.log('recommendation: ', recommendations);
        this.setState({ recommendations: recommendations });
      })
      .catch(err => {
        console.log(err);
      });
    console.log('getting recommendations');
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
        {/* <img className="background-img" src="/img/login_background3.jpg" alt="" /> */}
        <div className="container-fluid row">
          <div className="posts col-12 col-md-8">
            <div className="row">
              <div className="col-2">
                <h3>Posts</h3>
              </div>
              <div className="col-10">
                <span className="float-right">
                  <span className="ml-3">Category:</span>
                  {/* <div className="input-group"> */}
                  <select id="category-selection" name="category">
                    <option value="All">All</option>
                    <option value="CS">CS</option>
                    <option value="Education">Education</option>
                    <option value="Travel">Travel</option>
                    <option value="Technology">Technology</option>
                    <option value="Following">Following</option>
                  </select>
                  {/* </div> */}

                  <span className="ml-3">Sort By:</span>
                  <select id="sort-selection" name="sort_by">
                    <option value="created_at">Time</option>
                    <option value="views">Views</option>
                    <option value="likes">Likes</option>
                    <option value="favs"># of Favourite</option>
                  </select>
                  <button
                    className="ml-3 btn btn-sm btn-outline-success confirm-btn"
                    onClick={this.applyFilters}
                  >
                    Confirm
                  </button>
                </span>
              </div>
            </div>
            {(function () {
              if (posts.length === 0) {
                return (
                  <React.Fragment>
                    <br />
                    <br />
                    <h3 className="text-center">No Post Found</h3>
                  </React.Fragment>
                );
              }
            })()}
            {posts.map(post => {
              return <Post key={uid(Math.random())} post={post} />;
            })}
          </div>
          <div className="recommendations col-12 col-6 col-md-4">
            <div className="sticky-top" style={{ top: '5em' }}>
              <h3>Recommendations</h3>
              <ul className="list-group recommendation-list">
                {this.state.recommendations.map(recommendation => {
                  return (
                    <li key={uid(Math.random())} className="list-group-item">
                      <Link to={'/single_post/' + recommendation._id}>
                        {recommendation.title}
                      </Link>
                    </li>
                  );
                })}
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
