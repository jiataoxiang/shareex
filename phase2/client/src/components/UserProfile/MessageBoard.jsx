import Message from './Message';
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class MessageBoard extends React.Component {

  _isMount = true;

  state = {
    author: this.props.author,
    messages: [],
  };

  checkUserProfile = () => {
    return this.props.current_user._id === this.state.author;
  };

  componentDidMount() {
    this._isMount = true;
    this.getUserInfo();
  }

  sendMessage = () => {
    const message = document.getElementById('message').value;
    const current_user_id = this.props.current_user._id;

    axios
      .post(
        `/api/users/add-messenger/${this.state.author}`,
        {
          messenger_id: current_user_id,
          content: message,
        },
        this.props.tokenConfig(),
      )
      .then(() => {
      })
      .catch(error => {
        console.log(error);
      });

    this.getUserInfo();
  };

  getUserInfo = () => {
    axios.get(`/api/users/${this.state.author}`, this.props.tokenConfig()).then(user => {
      user = user.data;
      if (this._isMount) {
        this.setState({
          messages: user.messages,
        });
      }
    });
  };

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    const messages = this.state.messages;
    return (
      <div className="message-board">
        {this.checkUserProfile() ? null : (
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <button className="input-group-text" onClick={this.sendMessage.bind(this)}>
                Send
              </button>
            </div>
            <input
              type="text"
              className="form-control"
              id="message"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              name="message"
            />
          </div>
        )}
        <div className="overflow-auto">
          <h3>Message Board</h3>
          {messages.length === 0 ? (
            <h4 className="text-center">No Message Yet</h4>
          ) : (
            messages.reverse().map(message => {
              return <Message key={uid(Math.random())} message={message} />;
            })
          )}
        </div>
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

export default connect(mapStateToProps)(MessageBoard);
