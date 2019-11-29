import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../stylesheets/prof_set.scss";
import "../../stylesheets/animation.scss";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import store from '../../store';
import { loadUser } from '../../actions/authActions';

const validator = require('validator');

class ProfSet extends Component {
  state = {
    profAvatarFile: null,
    profAvatarUrl: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    profEmail: "place@holder.com",
    profMotto: "",
    profPassword: ""
  };

  // The text boxes for input.
  inputGroups = {
    inputEmail: null,
    inputMotto: null,
    inputPassword: null
  };

  // Text box input handler.
  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({[name]: value});
  }

  // Change the displaying avatar.
  changeAvatar = (event) => {
    const inputFile = event.target.files[0]

    if (inputFile != null) {
      const is_valid_image = ['image/jpeg', 'image/png', 'image/jpg'].includes(
        inputFile.type
      );

      if (!is_valid_image) {
        inputFile.status = 'error';
        console.log("You can only upload png or jpg files.");
      } else {   
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({
              profAvatarFile: inputFile,
              profAvatarUrl: imgReader.result
          });
        })
        imgReader.readAsDataURL(inputFile);
      }
    }
  }
  
  // Save the avatar to server.
  // TODO: this img saving method may need to change.
  saveAvatar = () => {
      if (this.state.profAvatarFile) {
          const formData = new FormData();
          formData.append('file', this.state.profAvatarFile);
          formData.append('public_id', `${'avatar'}_${this.props.current_user._id}`);
          console.log('Uploading avatar');
          axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            // const public_id = res.data[0].public_id;
            const url = res.data[0].url;
            axios.patch(
              `/api/users/${this.props.current_user._id}`,
              { avatar: url },
              this.tokenConfig()
            ).then(res => {
              this.props.current_user.avatar = this.state.profAvatarUrl;
              alert("Avatar saved.")
              document.getElementById("button-cancel").click();
            })
        }).catch(err => {
          console.log(err);
        });
      }
  }

  // Clear content in the password text box.
  clearPassword = () => {
    this.setState({profPassword: ""});
  }

  // Remove error properties for all textboxes.
  clearAllError = () => {
    for (let i in this.inputGroups) {
        this.clearError(this.inputGroups[i])
    }
  }

  // Remove error properties.
  clearError = (object) => {
    object.style.backgroundColor = "white";
    object.parentElement.classList.remove("errorShake");
  }
  
  // Add error properties.
  setError = (object) => {
    object.style.backgroundColor = "lightpink";
    object.parentElement.classList.add("errorShake");
  }

  // Check if email is valid.
  checkEmail = () => {
    const validEmail = validator.isEmail(this.state.profEmail);
    if (validEmail) {
        this.clearError(this.inputGroups.inputEmail);
    } else {
        this.setError(this.inputGroups.inputEmail);
    }
    return validEmail;
  }

  // Check if password is valid.
  checkPassword = () => {
    if (this.state.profPassword.length < 4 && this.state.profPassword.length != 0) {
      this.setError(this.inputGroups.inputPassword);
      return false;
    } else {
      this.clearError(this.inputGroups.inputPassword);
      return true;
    }
  }
  
  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

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

  // get profile from server
  getProf = () => {
    const currentUser = this.props.current_user;
    if (! currentUser) {
        window.location.href = '/';
    } else if (currentUser.admin) {
        window.location.href = '/';
    } else {
        this.setState({
          profAvatarFile: null,
          profAvatarUrl: currentUser.avatar,
          profEmail: currentUser.email,
          profMotto: currentUser.motto
        });     
    }
    
    this.clearPassword();
    
    // to make sure the animation works properly
    this.clearAllError();

    console.log("Profile loaded from server.");
  }

  // check validity, then send new profile to server
  setProf = () => {
    // to make sure the animation works properly
    this.clearAllError();

    const correctEmail = this.checkEmail();
    const correctPassword = this.checkPassword();

    if (correctEmail && correctPassword) {
      let toPatch;
      if (this.state.profPassword.length === 0) {
          toPatch = {
              email: this.state.profEmail,
              motto: this.state.profMotto
          };
      } else {
          toPatch = {
              email: this.state.profEmail,
              motto: this.state.profMotto,
              password: this.state.profPassword
          };
      }
    
      // send new profile to server
      axios.patch(
          `/api/users/${this.props.current_user._id}`, toPatch, this.tokenConfig()
      ).then(result => {
          if (result.status === 200) {
              this.props.current_user.email = toPatch.email;
              this.props.current_user.motto = toPatch.motto;
              alert("Profile saved.");
              return true;
          } else {
              alert("Profile failed to save.");
              return false;
          }
      }).then(result => {
          this.saveAvatar();
      }).catch(err => {
          console.log(err);
      })
    }
  }

  componentDidMount() {
    this._isMounted = true;
    
    // Get the text boxes.
    for (let i in this.inputGroups) {
        this.inputGroups[i] = document.getElementById(i)
    }

    // Read data from server.
    this.getProf();
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    if (!this.props.isAuthenticated) {
      window.location.href = '/';
    }
    
    return (
      <div className="container profset-page">
        {this.state.alert ? (
          <div className="alert alert-primary" role="alert">
            {this.state.alert}
          </div>
        ) : null}
        <h1 className="prof-set-title">Edit Profile</h1>

        <div className="avatar-container">
          <img src={this.state.profAvatarUrl}
               className="avatar-img"
               alt=""/>
          <div className="input-file">
            <h6>Change Avatar</h6>
            <input type="file"
                   id="import-file-avatar"
                   onChange={this.changeAvatar}/>
          </div>
        </div>

        <div className="prof-set-cont">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                  Email
                </span>
            </div>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              name="profEmail"
              value={this.state.profEmail}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                  Motto
                </span>
            </div>
            <input
              type="text"
              className="form-control"
              id="inputMotto"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              name="profMotto"
              value={this.state.profMotto}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                  Password
                </span>
            </div>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              name="profPassword"
              value={this.state.profPassword}
              onChange={this.handleInputChange}
              onClick={this.clearPassword}
            />
          </div>
        </div>

        <div className="btn-toolbar" role="toolbar">
          <button type="submit"
                  className="btn btn-light btn-md btn-block"
                  onClick={this.getProf}>
            Reset
          </button>
          <Link to="/userprofile">
            <button type="submit"
                    id="button-cancel"
                  className="btn btn-light btn-md btn-block">
                Cancel
            </button>
          </Link>
          <button type="submit"
                  className="btn btn-light btn-md btn-block"
                  onClick={this.setProf}>
            Save
          </button>
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
  auth: state.auth
});

export default connect(mapStateToProps)(ProfSet);
