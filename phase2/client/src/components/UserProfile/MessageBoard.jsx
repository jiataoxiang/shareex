import Message from './Message';
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class MessageBoard extends React.Component {
  state = {
    author: this.props.author,
    messages: [],
  };

  checkUserProfile = () => {
    console.log('current user is : ' + this.props.current_user._id);
    console.log('post user is : ' + this.state.author);
    return this.props.current_user._id === this.state.author;
  };

  componentDidMount() {
    this.getUserInfo();
  }

  sendMessage = () => {
    const message = document.getElementById('message').value;
    const current_user_id = this.props.current_user._id;
    console.log(this.state.author);

    axios
      .post(
        `/api/users/add-messenger/${this.state.author}`,
        {
          messenger_id: current_user_id,
          content: message,
        },
        this.props.tokenConfig(),
      )
      .then(user => {
        console.log(user);
      })
      .catch(error => {
        console.log(error);
      });

    this.getUserInfo();
  };

  getUserInfo = () => {
    axios.get(`/api/users/${this.state.author}`, this.props.tokenConfig()).then(user => {
      user = user.data;
      console.log(user);
      this.setState({
        messages: user.messages,
      });
    });
  };

  render() {
    const messages = this.state.messages;
    return (
      <div>
        {/* <div className="space"/> */}
        <div className="overflow-auto">
          <h3>Message Board</h3>
          {messages ? (
            <h4 className="text-center">No Message Yet</h4>
          ) : (
            messages.map(message => {
              return <Message key={uid(Math.random())} message={message} />;
            })
          )}
        </div>
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
