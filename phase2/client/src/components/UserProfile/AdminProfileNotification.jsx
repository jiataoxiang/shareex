import React from 'react';

class AdminProfileNotification extends React.Component {
    state = {
        notifications: [],
        inputsearch: ""
    };
    
    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    render() {
        return (
            <div id="notification-tab">
                <div id="search-notification">
                    <input
                        type="text"
                        id="search-input" 
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        name="inputid" 
                        value={this.state.inputsearch} 
                        onChange={this.handleInputChange}
                    />
                    <button type="button" 
                        className="btn">Search</button>
                </div>
            </div>
        );
    }
}

export default AdminProfileNotification;