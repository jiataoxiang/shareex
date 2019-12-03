import React from 'react';
import '../stylesheets/notification.scss';
import { Link } from 'react-router-dom';
const datetime = require('date-and-time');

class NotificationCard extends React.Component {
    state = {
        _user_id: null,
        admin: false,
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
        username: null,
        _noti_id: "",
        body: "",
        link: "",
        type: "",
        day: "",
        time: "",
        read: true,
        
        highlight: ""
    };

    // Replace the all words in the search bar with different font.
    highlightBody = () => {
        const keyArray = this.state.highlight.split(' ');
        const highlightText = this.state.body.replace(
            new RegExp(keyArray.join("|"), "ig"),
            str => `<Fragment class="text-highlight">${str}</Fragment>`
        );
        return (<div className="text-container" dangerouslySetInnerHTML={{ __html: highlightText }} />);
    }

    componentDidMount() {
        const msg = this.props.msg;
        const time = new Date(Date.parse(msg.time));
        
        if (msg.admin) {
            this.setState({ 
                _user_id: msg._user_id,
                admin: msg.admin,
                avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
                username: "System",
                _noti_id: msg._noti_id,
                body: msg.body,
                link: msg.link,
                type: msg.type,
                time: datetime.format(time, 'MMM DD YYYY hh:mm:ss'),
                read: msg.read, 
                highlight: this.props.search
            });
        } else {
            this.setState({ 
                _user_id: msg._user_id,
                admin: msg.admin,
                avatar: msg.avatar,
                username: msg.username,
                _noti_id: msg._noti_id,
                body: msg.body,
                link: msg.link,
                type: msg.type,
                time: datetime.format(time, 'MMM DD YYYY hh:mm:ss'),
                read: msg.read, 
                highlight: this.props.search
            });
        }
    }

    render() {
        return (
            <div className="notification-card row border rounded">
                <div className="author-container">
                    { this.state.admin ? 
                        <img className="avatar" src={ this.state.avatar } alt="" /> :
                        <Link to={`/otherprofile/${this.state._user_id}`}>
                            <img className="avatar" src={ this.state.avatar } alt="" />
                        </Link>
                    }
                    <h6>{ this.state.username }</h6>
                </div>
                <div className="contant-container col">
                    { this.highlightBody() }
                    <span className="msg-status">
                        <span className="msg-time">
                            { this.state.time }
                        </span>
                        {
                            this.state.link ? 
                            <Link className="msg-link" 
                                to={this.state.link}>
                                Detail
                            </Link> : 
                            null
                        }
                    </span>
                </div>
            </div>
        );
    }
}

export default NotificationCard;
