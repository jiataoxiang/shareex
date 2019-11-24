import React from 'react';

class AdminProfileFindUser extends React.Component {
    state = {
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
        username: "",
        nickname: "",
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
    
    getUserInfo = () => {
        //
        
        if (true) {
            this.setState({ inputmsg: "" });
            this.tempElements.display_user.removeAttribute("hidden");
            if (this.state.banned) {
                this.tempElements.display_banned.removeAttribute("hidden");
                this.tempElements.button_ban.innerHTML = "Unban";
            } else {
                this.tempElements.display_banned.setAttribute("hidden", true);
                this.tempElements.button_ban.innerHTML = "Ban";
            }
        } else {
            this.tempElements.display_user.setAttribute("hidden", true);
            alert("The user does not exist.");
        }
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
        const newMsg = {
            from: "System",
            to: this.state.username,
            body: this.state.inputmsg,
            link: null,
        }
        
        //
    }
    
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
                    <div className="row">
                        <div className="col-md-4>">
                            <img id="user-avatar" src={this.state.avatar} alt="" />
                        </div>
                        <div id="text-block" className="col-md-6">
                            <h5>Nickname:  {this.state.nickname}</h5>
                            <p>Username:  {this.state.username}</p>
                        </div>
                    </div>
                    
                    <div className="row">
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
                    
                     <div className="row">
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

export default AdminProfileFindUser;