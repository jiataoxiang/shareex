import React from 'react';

class AdminProfileFindUser extends React.Component {
    state = {
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
        username: "",
        nickname: "",
        banned: false,
        unbanned_date: null,
        
        inputuser: ""
    };

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }
    
    getUserInfo = () => {
        
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
                        className="btn">Find</button>
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
                            className="btn">Ban
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
                            />
                        </div>
                        <div className="col-md-4">
                            <button type="button" 
                                className="btn">Send Message
                            </button>
                        </div>
                    
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminProfileFindUser;