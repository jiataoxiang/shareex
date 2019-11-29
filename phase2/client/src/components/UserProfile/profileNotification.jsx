import React from 'react';
import { uid } from 'react-uid';
import NotificationCard from "../NotificationCard";

class AdminProfileNotification extends React.Component {
    state = {
        readMsg: [],
        unreadMsg: [],
        inputsearch: ""
    };
    
    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }
    
    componentDidMount() {
        this.setState({readMsg: this.props.state.readMsg, 
                       unreadMsg: this.props.state.unreadMsg});
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
                            msg.body.includes(this.state.inputsearch)) {
                            return <NotificationCard key={uid(Math.random())} msg={msg} />
                        }
                    })}
                    <h4>---- Old ----</h4>
                    {this.state.readMsg.map(msg => {
                        if (this.state.inputsearch === "" || 
                            msg.body.includes(this.state.inputsearch)) {
                            return <NotificationCard key={uid(Math.random())} msg={msg} />
                        }
                    })}
                </div>
            </div>
        );
    }
}

export default AdminProfileNotification;