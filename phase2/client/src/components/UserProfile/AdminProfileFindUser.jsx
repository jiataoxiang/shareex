import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class AdminProfileFindUser extends React.Component {
    state = {
        id: "",
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
        username: "",
        email: "",
        motto: "132456789132456789123456789 131356aw1d4a56w1fda51fa35 1f3a1d5aw31fd35a1wf351aw35f1wa35f1",
        banned: false, 
        unbanned_date: null,
        
        inputuser: "", 
        inputmsg: ""
    };
    tempElements = {
        display_user: null,
        display_banned: null,
        button_ban: null
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }
    
    showUser = () => {
        this.setState({ inputmsg: "" });
        this.tempElements.display_user.removeAttribute("hidden");
        if (this.state.banned) {
            this.tempElements.display_banned.removeAttribute("hidden");
            this.tempElements.button_ban.innerHTML = "Unban";
        } else {
            this.tempElements.display_banned.setAttribute("hidden", true);
            this.tempElements.button_ban.innerHTML = "Ban";
        }
    }
    hideUser = () => {
        this.tempElements.display_user.setAttribute("hidden", true);
        alert("The user does not exist.");
    }
    
    getUserInfo = () => {
        if (this.state.inputuser.length < 4) {
            alert("Invalid username.")
        } else {
            axios.get(
                `/api/users/username/${this.state.inputuser}`, this.tokenConfig()
            ).then(user => {
                if (!user || user.data.length === 0 || user.data[0].admin) {
                    this.hideUser();
                } else {
                    this.setState({id: user.data[0]._id,
                                   avatar: user.data[0].avatar,
                                   username: user.data[0].username, 
                                   email: user.data[0].email, 
                                   motto: user.data[0].motto, 
                                   banned: user.data[0].banned, 
                                   unbanned_date: user.data[0].unbanned_date});
                    this.showUser();
                }
            }).catch(error => {
                console.log(error);
            })
        }
    }
    
    resetMotto = () => {
        const newMotto = "Welcome, new user";
        
        const msgBody = "Your motto is reset due to containing inappropriate language";
        const success = "Notified " + this.state.username;
        const fail = "Could not notifiy the user.";
        
        axios.patch(
          `/api/users/${this.state.id}`, {motto: newMotto}, this.tokenConfig()
        ).then(result => {
          if (result.status === 200) {
              this.props.current_user.motto = newMotto;
              this.setState({motto: newMotto});
              alert("Motto reset.");
              return true;
          } else {
              alert("Motto failed to reset.");
              return false;
          }
        }).then(result => {
          if (result) {
              this.sendMsgToServer(msgBody, success, fail);
          }
        }).catch(err => {
          console.log(err);
        })
    }
    
    changeBan = () => {
        if (this.state.banned) {
            //
            
            this.setState({ banned: false });
            this.tempElements.display_banned.setAttribute("hidden", true);
            this.tempElements.button_ban.innerHTML = "Ban";
        } else {
            //
            
            this.setState({ banned: true });
            this.tempElements.display_banned.removeAttribute("hidden");
            this.tempElements.button_ban.innerHTML = "Unban";
        }
    }
    
    sendMsg = () => {
        if (this.state.inputmsg.length === 0) {
            alert("A message must have some contant.");
        } else {
            this.sendMsgToServer(this.state.inputmsg, 
                                 "Message sent.", 
                                 "Message failed to send.");
        }
    }
    
    sendMsgToServer = (msgBody, success, fail) => {
        const newMsg = {
            from: this.props.current_user._id,
            to: this.state.id,
            body: msgBody
        } 
        
        axios.post(
            `/api/notifications/create`, newMsg, this.tokenConfig()
        ).then(msg => {
            if (!msg) {
                alert(fail);
            } else {
                alert(success);
            }
        }).catch(err => {
            console.log(err);
        })
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
    
    componentDidMount() {
        this.tempElements.display_user = document.getElementById("display-user");
        this.tempElements.display_user.setAttribute("hidden",true);
        
        this.tempElements.display_banned = document.getElementById("ban-warning");
        this.tempElements.display_banned.setAttribute("hidden",true);
        
        this.tempElements.button_ban = document.getElementById("button-ban");
    }
    
    render() {
        return (
            <div id="finduser">
                <div id="search-user">
                    <p>Find user by username:</p>
                    <input
                        type="text"
                        id="user-id-input" 
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        name="inputuser" 
                        value={this.state.inputuser} 
                        onChange={this.handleInputChange}
                    />
                    <button type="button" 
                        className="btn"
                        onClick={this.getUserInfo}>Find</button>
                </div>
                
                <div id="display-user">
                    <div className="row row-info">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="avatar-container">
                              <img id="user-avatar" src={this.state.avatar} alt="" />
                              <h6>{this.state.username}</h6>
                            </div>
                            <div id="text-block" className="col-md-8">
                              <p>Email:  {this.state.email}</p>
                              <p>Motto:  {this.state.motto}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                            <button type="button"
                                id="button-reset" 
                                className="btn"
                                onClick={this.resetMotto}>
                                Reset Motto
                            </button>
                        </div>
                    </div>
                    
                    <div className="row row-ban">
                        <div className="col-md-8">
                             <div id="ban-warning">
                                <h6>Will be unbanned on {this.state.username}</h6>
                             </div>
                        </div>
                        <div className="col-md-4">
                            <button type="button"
                                id="button-ban" 
                                className="btn"
                                onClick={this.changeBan}>
                                Ban
                            </button>
                        </div>
                    </div>
                    
                     <div className="row row-msg">
                        <div className="col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Sizing example input"
                                aria-describedby="inputGroup-sizing-default" 
                                name="inputmsg" 
                                value={this.state.inputmsg} 
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <button type="button" 
                                className="btn"
                                onClick={this.sendMsg}>
                                Send Message
                            </button>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(AdminProfileFindUser);
