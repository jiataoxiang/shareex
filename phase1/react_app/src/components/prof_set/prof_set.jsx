import React, { Component } from "react";
import "../../stylesheets/prof_set.scss";
import "../../stylesheets/animation.scss";

class ProfSet extends Component {
  state = {
      profUsername: "",
      profEmail: "",
      profLocation: "",
      profTelephone: "",
      profPassword: "",
      profAvatarUrl: ""
  };

  inputGroups = {
      inputUsername: null,
      inputEmail: null,
      inputLocation: null,
      inputTelephone: null,
      inputPassword: null
  };

  handleInputChange = (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      
      this.setState({[name]: value});
  }
  
  handleInputFile = (event) => {
      const inputFile = event.target.files[0]
      
      if (inputFile != null) {
          const isJPG = inputFile.type === 'image/jpeg';
          const isPNG = inputFile.type === 'image/png';
          
          if (!isJPG && !isPNG) {
              inputFile.status = 'error';
              console.log("You can only upload png or jpg files.");
          } else {
              const imgReader = new FileReader();
              imgReader.addEventListener('load', ()=>{
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
      this.clearError(this.inputGroups.inputUsername);
      this.clearError(this.inputGroups.inputEmail);
      this.clearError(this.inputGroups.inputPassword);
  }
  
  setError = (object) => {
      object.style.backgroundColor = "lightpink";
      object.parentElement.classList.add("errorShake");
  }
  
  clearError = (object) => {
      object.style.backgroundColor = "white";
      object.parentElement.classList.remove("errorShake");
  }
  
  checkUsername = () => {
      const emptyString = this.state.profUsername.length === 0;
      
      if (emptyString) {
          this.setError(this.inputGroups.inputUsername);
          return false;
      } else {
          this.clearError(this.inputGroups.inputUsername);
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
      
      // this is some fake data that we get from server
      this.setState({profUsername: "tempUsername"});
      this.setState({profEmail: "tempEmail"});
      this.setState({profLocation: "tempLocation"});
      this.setState({profTelephone: "tempTelephone"});
      this.setState({profPassword: "tempPassword"});
      this.setState({profAvatarUrl: process.env.PUBLIC_URL + "./img/avatar_default.jpg"});
      
      console.log("Profile loaded from server.");
  } 
  
  // check validity, then send new profile to server
  setProf = () => {
      // to make sure the animation works properly
      this.clearAllError();
      
      const correctUsername = this.checkUsername();
      const correctEmail = this.checkEmail();
      const correctPassword = this.checkPassword();
      
      if (correctUsername && correctEmail && correctPassword) {
          // send new profile to server
          
          alert("Profile saved.")
      }
  }
  
  isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  }
  
  componentDidMount() {
      if(this.isMobileDevice()) {
          const page = document.getElementById("profset-page");
          page.classList.remove("profset-page");
          page.classList.add("profset-page-mobile");
      }
      
      this.inputGroups.inputUsername = document.getElementById("inputUsername");
      this.inputGroups.inputEmail = document.getElementById("inputEmail");
      this.inputGroups.inputLocation = document.getElementById("inputLocation");
      this.inputGroups.inputTelephone = document.getElementById("inputTelephone");
      this.inputGroups.inputPassword = document.getElementById("inputPassword");
      
      this.getProf();
  }
  
  render() {
    return (
      <div className="container profset-page"
          id="profset-page">
        <h1 className="prof-set-title">Edit Profile</h1>
            
        <div className="avatar-container">
            <img src={this.state.profAvatarUrl}
                className="avatar-img"
                alt="" />
            <div className="input-file">
                <h6>Change Avatar</h6>
                <input type="file"
                    id="import-file-avatar"
                    onChange={this.handleInputFile}/>
            </div>
        </div>
            
        <div className="prof-set-cont">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  Username
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default" 
                name="profUsername"
                value={this.state.profUsername} 
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
                  Location
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputLocation"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                name="profLocation"
                value={this.state.profLocation} 
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
        </div>
        
        <div className="btn-toolbar" role="toolbar">
            <button type="submit" 
                className="btn btn-outline-primary btn-md btn-block"
                onClick={this.getProf}>
                Cancel
            </button>
            <button type="submit" 
                className="btn btn-primary btn-md btn-block"
                onClick={this.setProf}>
                Save
            </button>
        </div>  
      </div>
    );
  }
}

export default ProfSet;
