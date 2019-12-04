import React, { Component } from 'react';
import Post from '../Post';
import User from './User';
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
    users: [],
    recommendations: [],
  };

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.history.push('/login');
      return;
    }
    if (this.props.location && this.props.location.state) {
      if (this.props.location.state.search_content) {
        this.search(this.props.location.state.search_content);
      } else if (this.props.location.state.search_content === '') {
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
        this.search();
      }
    }
  }

  search = search_content => {
    const display_post = document.getElementById('search-type-select').value === 'post';
    if (display_post) {
      axios
        .get(`/api/posts/search/${search_content}`, this.tokenConfig())
        .then(res => {
          this.setState({ posts: res.data.posts });
        })
        .catch(error => {
          console.log(error.message);
        });
    } else {
      axios
        .get(`/api/users/search/${search_content}`, this.tokenConfig())
        .then(res => {
          this.setState({ users: res.data.users });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  updatePosts = (category, sort_by) => {
    const search_content = document.getElementById('search-bar').value;
    if (!sort_by) sort_by = 'created_at';
    const config = this.tokenConfig();
    config.params = {
      sort_by,
      category,
      search_content,
      following: this.props.current_user.following,
    };
    axios
      .get('/api/posts', config)
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

  /* Recommendations are selected as those posts with more than 10 likes
    Only at most 10 are selected randomly */
  // getRecommendations() returns the recommendations to be displayed on home page
  updateRecommendations = () => {
    axios
      .get('/api/posts/recommendations', this.tokenConfig())
      .then(res => {
        const recommendations = res.data;
        this.setState({ recommendations: recommendations });
      })
      .catch(err => {
        console.log(err);
      });
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
    const display_post = document.getElementById('search-type-select').value === 'post';
    const posts = this.state.posts;
    const users = this.state.users;
    const show_filter = document.getElementById('search-type-select').value === 'post';
    return (
      <div className="home-page">
        {/* <img className="background-img" src="/img/login_background3.jpg" alt="" /> */}
        <div className="container-fluid row">
          <div className="posts col-12 col-md-8">
            <div className="row">
              <div className="col-sm-2">
                <h3>Posts</h3>
              </div>
              <div className="col-sm-10">
                {show_filter ? (
                  <span className="float-right selections" id="post-filters">
                    <span className="categroy">
                      <span className="ml-3">Category:</span>
                      <select id="category-selection" name="category">
                        <option value="All">All</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Travel">Travel</option>
                        <option value="Education">Education</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Other">Other</option>
                        <option value="Following">Following</option>
                      </select>
                    </span>
                    <span className="sort">
                      <span className="ml-3">Sort By:</span>
                      <select id="sort-selection" name="sort_by">
                        <option value="created_at">Time</option>
                        <option value="views">Views</option>
                        <option value="likes">Likes</option>
                        <option value="favs"># of Favourite</option>
                      </select>
                    </span>
                    <button
                      className="ml-3 btn btn-sm btn-outline-success confirm-btn"
                      onClick={this.applyFilters}
                    >
                      Confirm
                    </button>
                  </span>
                ) : null}
              </div>
            </div>

            {display_post && posts.length === 0 ? (
              <React.Fragment>
                <br />
                <br />
                <h3 className="text-center">No Post Found</h3>
              </React.Fragment>
            ) : null}
            {!display_post && users.length === 0 ? (
              <React.Fragment>
                <br />
                <br />
                <h3 className="text-center">No User Found</h3>
              </React.Fragment>
            ) : null}
            {display_post
              ? posts.map(post => {
                  return <Post key={uid(Math.random())} post={post} />;
                })
              : users.map(user => {
                  return (
                    <User
                      key={uid(Math.random())}
                      username={user.username}
                      avatar={user.avatar}
                      email={user.email}
                      id={user._id}
                    />
                  );
                })}
          </div>
          <div className="recommendations col-12 col-6 col-md-4">
            <div className="sticky-top" style={{ top: '5em' }}>
              <h3>Recommendations</h3>
              <ul className="list-group recommendation-list">
                {this.state.recommendations.map(recommendation => {
                  return (
                    <li key={uid(Math.random())} className="list-group-item">
                      <Link to={'/single_post/' + recommendation._id}>{recommendation.title}</Link>
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
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(Home));
