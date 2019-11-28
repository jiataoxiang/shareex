import React from 'react';
import axios from "axios";
import '../../stylesheets/Message_board.scss';
import { connect } from 'react-redux';

class MessageBoard extends React.Component {
  _isMount = false;

  state = {
    message: this.props.message,
    messenger_name: "",
    messenger_avatar: ""
  };

  componentDidMount() {
    this._isMount = true;
    //get follower avatar and name
    axios.get(`/api/users/${this.state.message.messenger_id}`, this.props.tokenConfig())
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
        <div className="media text-muted pt-3">
          <img src={this.state.messenger_avatar} alt="" className="mr-2 rounded"
               width="32" height="32"/>
          <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
            <strong className="d-block text-gray-dark">{this.state.messenger_name}</strong>
            {this.state.message.content}
          </p>
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