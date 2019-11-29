import Message from "./Message";
import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';

class MessageBoard extends React.Component {
  state = {
    author: this.props.author,
    messages: []
  };

  componentDidMount() {
    this.getUserInfo()
  }

  getUserInfo = ()=>{
    axios.get(`/api/users/${this.state.author}`, this.props.tokenConfig())
      .then((user) => {
        user = user.data;
        console.log(user);
        this.setState({
          messages: user.messages
        })
      })
  };

  render() {
    return (
      <div>
        <div className="space"/>
        <div className="overflow-auto">
          <h6>Message Board</h6>
          {this.state.messages.map(message => {
            return <Message key={uid(Math.random())} message={message}/>
          })}
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