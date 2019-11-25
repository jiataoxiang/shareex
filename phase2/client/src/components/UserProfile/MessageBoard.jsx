import React from 'react';
import axios from "axios";
import '../../stylesheets/Message_board.scss';
import { connect } from 'react-redux';

class MessageBoard extends React.Component {
  _isMount = false;

  state = {
    message: this.props.message,
  };

  componentDidMount() {
    this._isMount = true;
    //get follower avatar and name
    axios.get(`/api/users/${this.state.message._id}`, this.props.tokenConfig())
      .then((messenger) => {
        if(this._isMount){
          this.setState({
            messenger_name: messenger.data.username,
            messenger_avatar: messenger.data.avatar,
          })
        }
      }).catch((error) => {
      console.log(error)
    })
  };

  componentWillUnmount() {
    this._isMount = false;
  };


  render() {
    return (
      <div className="message-board">
        <img src={this.state.messenger_avatar} className="avatar-image" alt="avatar"/>
        <span className="username-text">{this.state.messenger_name}</span>
        <span>{this.state.message.content}</span>
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

export default connect(mapStateToProps)(MessageBoard);