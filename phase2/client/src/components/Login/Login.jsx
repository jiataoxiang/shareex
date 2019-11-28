import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import '../../stylesheets/login.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class Login extends Component {
  state = {
    username: '',
    password: '',
    message: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    // update error message
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ message: error.message.message });
      } else {
        this.setState({ message: null });
      }
    }
  }

  colorTransition = () => {
    console.log('making color transition.');
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 800);
  };

  signin = e => {
    e.preventDefault();

    const { username, password } = this.state;
    const user = {
      username,
      password
    };
    // Attempt to login
    this.props.clearErrors();
    this.props
      .login(user)
      .then(res => {
        console.log(res);
        if (res.user.color_theme) {
          if (
            document.documentElement.getAttribute('theme') !==
            res.user.color_theme
          ) {
            this.colorTransition();
            document.documentElement.setAttribute(
              'theme',
              res.user.color_theme
            );
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    // // If alreadly loged in, go to home page.
    // if (this.props.cur_user) {
    //   alert('You already loged in!');
    //   this.props.history.push('/');
    // }
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div className="login-page">
        {this.state.message ? (
          <div className="alert alert-danger" role="alert">
            {this.state.message}
          </div>
        ) : null}
        <div className="form-container">
          <form action="" onSubmit={this.signin}>
            <div className="lock-container">
              <img
                src={'./img/lock.png'}
                width="40px"
                className="lock mx-auto"
                alt=""
              />
              <h3>Sign In</h3>
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Username
                </span>
              </div>
              <input
                name="username"
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                onChange={this.onChange}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Password
                </span>
              </div>
              <input
                name="password"
                type="password"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                onChange={this.onChange}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-md btn-block">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// getting from reducers (error and auth reducers)
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user
});

export default connect(mapStateToProps, { login, clearErrors })(
  withRouter(Login)
);
