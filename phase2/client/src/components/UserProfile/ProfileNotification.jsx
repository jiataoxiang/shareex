import React from 'react';
import { uid } from 'react-uid';
import { connect } from 'react-redux';
import axios from 'axios';
import NotificationCard from "../NotificationCard";

class AdminProfileNotification extends React.Component {
    state = {
        readMsg: [],
        unreadMsg: [],
        inputsearch: ""
    };
    
    // Input change handler.
    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }
    
    // Check if a notification contains any word in the search inputbox.
    checkSearch = (msgBody) => {
        let toReturn = false;
        this.state.inputsearch.split(' ').forEach(key => {
            if (key.length !== 0 && msgBody.includes(key)) {
                toReturn = true;
            }
        })
        return toReturn;
    }
    
    // Change the read status of all notifications read by this user on the server. 
    readNotifications = () => {
        axios
        .post(`/api/notifications/read/${this.props.auth.user._id}`, {}, this.tokenConfig())
        .then(result => {
            if (!result) {
                console.log('Notifications count not be read.');
            } else {
                console.log(result.data.nModified + ' new notifications read.');
            }
        })
        .catch(error => {
            console.log(error);
        });
    };

    tokenConfig = () => {
        // Get token from localstorage
        const token = this.props.auth.token;

        // Headers
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
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
        const readMsg = this.props.state.readMsg;
        const unreadMsg = this.props.state.unreadMsg;
        
        readMsg.sort(function(a, b){
            return Date.parse(b.time) - Date.parse(a.time);
        });
        unreadMsg.sort(function(a, b){
            return Date.parse(b.time) - Date.parse(a.time);
        });
        
        this.setState({readMsg: readMsg, 
                       unreadMsg: unreadMsg});
        this.readNotifications();
    }

    render() {
        return (
            <div id="notification-tab">
                <div id="search-notification">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text" >Search</span>
                        </div>
                        <input
                            type="text"
                            id="search-input" 
                            className="form-control"
                            aria-label="Sizing example input"
                            aria-describedby="inputGroup-sizing-default"
                            name="inputsearch" 
                            value={this.state.inputsearch} 
                            onChange={this.handleInputChange}
                        />
                    </div>
                </div>
                <div id="display-notification">
                    <h4>---- New ----</h4>
                    {this.state.unreadMsg.map(msg => {
                        if (this.state.inputsearch === "" || 
                            this.checkSearch(msg.body)) {
                            return <NotificationCard 
                                       key={uid(Math.random())} 
                                       msg={msg} 
                                       search={this.state.inputsearch} />
                        } else {
                            return null;
                        }
                    })}
                    <h4>---- Old ----</h4>
                    {this.state.readMsg.map(msg => {
                        if (this.state.inputsearch === "" || 
                            this.checkSearch(msg.body)) {
                            return <NotificationCard 
                                       key={uid(Math.random())} 
                                       msg={msg} 
                                       search={this.state.inputsearch} />
                        } else {
                            return null;
                        }
                    })}
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
  auth: state.auth,
});

export default connect(mapStateToProps)(AdminProfileNotification);
