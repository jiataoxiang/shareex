import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../../stylesheets/prof_set.scss";
import "../../stylesheets/animation.scss";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const validator = require('validator');

class ProfSet extends Component {
  state = {
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

  // This funtion only gets the temp url of the uploaded img now
  // TODO: change the following code in phase 2, so that we keep the file
  changeAvatar = (event) => {
    const inputFile = event.target.files[0]

    if (inputFile != null) {
      const isJPG = inputFile.type === 'image/jpeg';
      const isPNG = inputFile.type === 'image/png';

      if (!isJPG && !isPNG) {
        inputFile.status = 'error';
        console.log("You can only upload png or jpg files.");
      } else {
        const imgReader = new FileReader();
        imgReader.addEventListener('load', () => {
          this.setState({profAvatarUrl: imgReader.result});
        })
        imgReader.readAsDataURL(inputFile);
      }
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
    if (this.state.profPassword.length < 4) {
      this.setError(this.inputGroups.inputPassword);
      return false;
    } else {
      this.clearError(this.inputGroups.inputPassword);
      return true;
    }
  }

  // get profile from server
  getProf = () => {
    // to make sure the animation works properly
    this.clearAllError();

    const currentUser = this.props.current_user;
    console.log(currentUser)
    if (! currentUser) {
        window.location.href = '/';
    } else if (currentUser.type === "admin") {
        window.location.href = '/';
    } else if (this._isMounted) {
        this.setState({
          profAvatarUrl: currentUser.avatar,
          profEmail: currentUser.email,
          profMotto: currentUser.motto
        });     
    }

    console.log("Profile loaded from server.");
  }

  // check validity, then send new profile to server
  setProf = () => {
    // to make sure the animation works properly
    this.clearAllError();

    const correctEmail = this.checkEmail();
    const correctPassword = this.checkPassword();

    if (correctEmail && correctPassword) {
      // send new profile to server
      // TODO: change the following code in phase 2, to download data from server
      const currentUser = this.props.state.current_user;
        
      currentUser.avatar = this.state.profAvatarUrl;
        
      currentUser.nickname = this.state.profNickname;
      currentUser.email = this.state.profEmail;
      currentUser.tel = this.state.profTelephone;
      currentUser.password = this.state.profPassword;
      currentUser.motto = this.state.profMotto;

      alert("Profile saved.");
      this.props.history.push("/userprofile");
    }
  }

  componentDidMount() {
    // Get the text boxes.
    for (let i in this.inputGroups) {
        this.inputGroups[i] = document.getElementById(i)
    }

    // Read data from server.
    this._isMounted = true;
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
