import React, { Component } from 'react';
import '../../stylesheets/signup.scss';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { REGISTER_FAIL } from '../../actions/actionTypes';

class SignUp extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    message: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      if (error.id === REGISTER_FAIL) {
        // if new error type is not the same as the previous state's error type
        // update the error message
        this.setState({ message: error.message.message });
      } else {
        this.setState({ message: null });
      }
    }
  }

  signup = e => {
    e.preventDefault();
    this.props.clearErrors();
    const { username, email, password } = this.state;

    // Create user object
    const new_user = {
      username,
      email,
      password
    };

    // Attempt to register
    this.props.register(new_user);
  };

  componentDidMount() {
    // If alreadly loged in, go to home page.
    if (this.props.state.current_user) {
      alert('You already loged in!');
      this.props.history.push('/');
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    this.props.clearErrors();
  };

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <div className="signup-page">
        {this.state.message ? (
          <div className="alert alert-danger" role="alert">
            {this.state.message}
          </div>
        ) : null}
        <div className="form-container">
          <form action="" onSubmit={this.signup}>
            <h2 id="signup-title">Sign Up</h2>
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
                id="username"
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
                  Email
                </span>
              </div>
              <input
                name="email"
                type="text"
                id="email"
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
                id="password"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                onChange={this.onChange}
              />
            </div>

            {/* <div className="tab">
              <span>
                <input type="radio" name="gender" value="male" /> Male
              </span>
              <span>
                <input type="radio" name="gender" value="female" /> Female
              </span>
            </div> */}

            <button type="submit" className="btn btn-success btn-md btn-block">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { register, clearErrors })(
  withRouter(SignUp)
);

// export default SignUp;
