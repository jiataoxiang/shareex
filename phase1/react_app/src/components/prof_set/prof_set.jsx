import React, { Component } from "react";
import "../../stylesheets/prof_set.scss";

class ProfSet extends Component {
  state = {
      profUsername: "",
      profEmail: "",
      profLocation: "",
      profTelephone: "",
      profPassword: "",
      profAvatar: ""
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
                  this.setState({profAvatar: imgReader.result});
              })
              imgReader.readAsDataURL(inputFile);
          }
      }
  }
  
  clearPassword = () => {
      this.setState({profPassword: ""});
  }
  
  clearInputError = () => {
      const inputUsername = document.getElementById("inputUsername");
      inputUsername.style = "background-color: white;";
      const inputEmail = document.getElementById("inputEmail");
      inputEmail.style = "background-color: white;";
      const inputLocation = document.getElementById("inputLocation");
      inputLocation.style = "background-color: white;";
      const inputTelephone = document.getElementById("inputTelephone");
      inputTelephone.style = "background-color: white;";
      const inputPassword = document.getElementById("inputPassword");
      inputPassword.style = "background-color: white;";
  }
  
  checkUsername = () => {
      const emptyString = this.state.profUsername.length === 0;
      
      const inputUsername = document.getElementById("inputUsername");
      if (emptyString) {
          inputUsername.style = "background-color: lightpink;";
          return false;
      } else {
          inputUsername.style = "background-color: white;";
          return true;
      }
  }
  
  checkEmail = () => {
      const correctFormat = this.state.profEmail.indexOf('@') === -1;
      
      const inputEmail = document.getElementById("inputEmail");
      if (correctFormat) {
          inputEmail.style = "background-color: lightpink;";
          return false;
      } else {
          inputEmail.style = "background-color: white;";
          return true;
      }
  }
  
  checkPassword = () => {
      const emptyString = this.state.profPassword.length === 0;
      
      const inputPassword = document.getElementById("inputPassword");
      if (emptyString) {
          inputPassword.style = "background-color: lightpink;";
          return false;
      } else {
          inputPassword.style = "background-color: white;";
          return true;
      }
  }
  
  // get profile from server
  getProf = () => {
      this.setState({profUsername: "tempUsername"});
      this.setState({profEmail: "tempEmail"});
      this.setState({profLocation: "tempLocation"});
      this.setState({profTelephone: "tempTelephone"});
      this.setState({profPassword: "tempPassword"});
      this.setState({profAvatar: process.env.PUBLIC_URL + "./img/avatar_default.jpg"});
      
      this.clearInputError();
      console.log("Profile loaded from server.")
  } 
  
  // check validity, then send new profile to server
  setProf = () => {
      const correctUsername = this.checkUsername();
      const correctEmail = this.checkEmail();
      const correctPassword = this.checkPassword();
      
      if (correctUsername && correctEmail && correctPassword) {
          alert("Profile saved.")
      } else {
          alert("Please make sure your inputs are valid.")
      }
  }
  
  componentDidMount() {
      this.getProf();
  }
  
  render() {
    return (
      <div className="profset-page">
        <h1 className="prof-set-title">Edit Profile</h1>
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
        
        <div className="avatar-container">
            <img src={this.state.profAvatar}
                className="avatar-img"
                alt="" />
            <div>
                <h6>Change Avatar</h6>
                <input type="file"
                    onChange={this.handleInputFile}/>
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
