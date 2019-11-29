import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import '../stylesheets/navbar.scss';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';
import PropTypes from 'prop-types';
import axios from 'axios';
import { loadUser } from '../actions/authActions';
import store from '../store';

class Navbar extends React.Component {
  state = {};

  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  colorTransition = () => {
    console.log('making color transition.');
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 800);
  };

  getUserProfileButton = () => {
    if (!this.props.isAuthenticated) {
      return null;
    } else {
      return this.props.current_user.admin ? (
        <Link to="/adminprofile">
          <img id="user-avatar" src={this.props.current_user.avatar} alt="" />
        </Link>
      ) : (
        <Link to="/userprofile">
          <img id="user-avatar" src={this.props.current_user.avatar} alt="" />
        </Link>
      );
    }
  };

  search = event => {
    event.preventDefault();
    const search_bar = document.getElementById('search-bar');
    const search_content = search_bar.value;
    // search_bar.value = '';
    this.props.history.push({
      pathname: '/',
      state: {
        search_content
      }
    });
  };

  componentDidMount() {
    console.log('componentDidMount');
  }

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps');
  }

  tokenConfig = () => {
    // Get token from localstorage
    let token;
    if (this.props.isAuthenticated) {
      token = this.props.auth.token;
    }
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

  handleThemeChange = e => {
    const btn_clicked = e.target;
    btn_clicked.classList.add('active');
    const sibling_btn = btn_clicked.previousElementSibling
      ? btn_clicked.previousElementSibling
      : btn_clicked.nextElementSibling;
    sibling_btn.classList.remove('active');
    const btn_value = btn_clicked.value;
    // define transition function

    this.colorTransition();
    document.documentElement.setAttribute('theme', btn_value);

    // update theme in database
    if (this.props.isAuthenticated) {
      axios
        .patch(
          `/api/users/${this.props.current_user._id}`,
          {
            color_theme: btn_value
          },
          this.tokenConfig()
        )
        .then(res => {
          console.log(res.data);
          store.dispatch(loadUser());
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  render() {
    return (
      <nav className="navbar-page navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <Link
          id="logo-btn"
          to={{
            pathname: '/',
            state: {
              search_content: ''
            }
          }}
        >
          <img
            src={process.env.PUBLIC_URL + '/img/logo_S.png'}
            alt=""
            width="50px"
          />
          <span id="shareEx-logo-text">ShareEx</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <form className="form-inline my-2 my-lg-0" onSubmit={this.search}>
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  id="search-bar"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </li>
          </ul>

          <div
            id="theme-btn-group"
            className="btn-group"
            role="group"
            aria-label="..."
            onClick={this.handleThemeChange}
          >
            <button
              id="light-theme-btn"
              className="btn btn-light btn-sm"
              value="light"
              checked
            >
              Light
            </button>
            <button
              id="dark-theme-btn"
              className="btn btn-dark btn-sm"
              value="dark"
            >
              Dark
            </button>
          </div>

          {this.props.isAuthenticated ? (
            <Link className="nav-link nav-item" to="new_post">
              <button className="btn btn-outline-primary btn-sm">
                New Post
              </button>
            </Link>
          ) : null}
          {this.props.isAuthenticated ? (
            <button
              className="btn btn-outline-danger btn-sm logout-btn"
              onClick={this.props.logout}
            >
              Logout
            </button>
          ) : (
            <div className="btn-group">
              <Link to="/login">
                <button className="btn btn-primary btn-sm">Sign In</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-success btn-sm">Sign Up</button>
              </Link>
            </div>
          )}
          {this.props.isAuthenticated ? (
            <span id="welcome-msg">
              Welcome, <em>{this.props.current_user.username}</em>
            </span>
          ) : null}

          {this.getUserProfileButton()}
        </div>
      </nav>
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

export default connect(mapStateToProps, { logout })(withRouter(Navbar));
