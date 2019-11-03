import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../../stylesheets/prof_set.scss";
import "../../stylesheets/animation.scss";

class ProfSet extends Component {
  state = {
    profAvatarUrl: "",
    
    profNickname: "",
    profEmail: "",
    profTelephone: "",
    profPassword: "",
    profMotto: ""
  };

  inputGroups = {
    inputNickname: null,
    inputEmail: null,
    inputTelephone: null,
    inputPassword: null,
    inputMotto: null
  };

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({[name]: value});
  }

  // this funtion gets the temp url of the uploaded img
  // might be changed in phase 2
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

  clearPassword = () => {
    this.setState({profPassword: ""});
  }

  clearAllError = () => {
    for (let i in this.inputGroups) {
        this.clearError(this.inputGroups[i])
    }
  }

  clearError = (object) => {
    object.style.backgroundColor = "white";
    object.parentElement.classList.remove("errorShake");
  }
  
  setError = (object) => {
    object.style.backgroundColor = "lightpink";
    object.parentElement.classList.add("errorShake");
  }

  checkNickname = () => {
    const emptyString = this.state.profNickname.length === 0;

    if (emptyString) {
      this.setError(this.inputGroups.inputNickname);
      return false;
    } else {
      this.clearError(this.inputGroups.inputNickname);
      return true;
    }
  }

  checkEmail = () => {
    const emailFrag = this.state.profEmail.split('@');
    const worngFormat = emailFrag.length < 2 || emailFrag.length > 2 || emailFrag[0].length === 0 || emailFrag[1].length === 0;

    if (worngFormat) {
      this.setError(this.inputGroups.inputEmail);
      return false;
    } else {
      this.clearError(this.inputGroups.inputEmail);
      return true;
    }
  }

  checkPassword = () => {
    const emptyString = this.state.profPassword.length === 0;

    if (emptyString) {
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

    // this is some fake data that we get from server,
    // will be replaced in phase 2
    const currentUser = this.props.state.current_user;
    if (! currentUser) {
        alert("You need to log in first");
        this.props.history.push("/");
    } else if (currentUser.type === "admin") {
        alert("admin accounts cannot change profile");
        this.props.history.push("/");
    } else {
        this.setState({
          profAvatarUrl: currentUser.avatar,
          profNickname: currentUser.nickname,
          profEmail: currentUser.email,
          profTelephone: currentUser.tel,
          profPassword: currentUser.password,
          profMotto: currentUser.motto
        });     
    }

    console.log("Profile loaded from server.");
  }

  // check validity, then send new profile to server
  setProf = () => {
    // to make sure the animation works properly
    this.clearAllError();

    const correctNickname = this.checkNickname();
    const correctEmail = this.checkEmail();
    const correctPassword = this.checkPassword();

    if (correctNickname && correctEmail && correctPassword) {
      // send new profile to server
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
    for (let i in this.inputGroups) {
        this.inputGroups[i] = document.getElementById(i)
    }

    this.getProf();
  }

  render() {
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
                  Nickname
                </span>
            </div>
            <input
              type="text"
              className="form-control"
              id="inputNickname"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              name="profNickname"
              value={this.state.profNickname}
              onChange={this.handleInputChange}
            />
          </div>
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
                  Telephone
                </span>
            </div>
            <input
              type="text"
              className="form-control"
              id="inputTelephone"
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-default"
              name="profTelephone"
              value={this.state.profTelephone}
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

export default withRouter(ProfSet);
