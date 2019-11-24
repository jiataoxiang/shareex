import React from 'react';
import axios from "axios";
import '../../stylesheets/follower.scss';

class Follower extends React.Component {
  _isMount = false;

  state = {
    follower: this.props.follower
  };

  componentDidMount() {
    this._isMount = true;
    //get follower avatar and name
    axios.get(`/api/users/${this.state.follower}`)
      .then((follower) => {
        if(this._isMount){
          this.setState({
            follower_name: follower.data.username,
            follower_avatar: follower.data.avatar
          })
        }
      }).catch((error) => {
        console.log(error)
    })
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    return (
      <div className="follower">
        <img src={this.state.follower_avatar} className="avatar-image" alt="avatar"/>
        <span className="username-text">{this.state.follower_name}</span>
      </div>
    );
  }
}

export default Follower;