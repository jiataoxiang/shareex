import React from 'react';
import '../stylesheets/notification.scss';
import { Link } from 'react-router-dom';

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
        read: true
    };

    componentDidMount() {
        const msg = this.props.msg;
        
        const timeArray = msg.time.split('T');
        const day = timeArray[0];
        const time = timeArray[1].split('.')[0];
        
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
                day: day,
                time: time,
                read: msg.read
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
                day: day,
                time: time,
                read: msg.read
            });
        }
    }

    render() {
        return (
            <div className="notification-card row border rounded">
                <div className="author-container">
                    <img className="avatar" src={ this.state.avatar } alt="" />
                    <h6>{ this.state.username }</h6>
                </div>
                <div className="contant-container col">
                    <div>{ this.state.body }</div>
                    <span className="msg-status">
                        <span className="msg-time">
                            { this.state.day }
                            { '  ' }
                            { this.state.time }
                        </span>
                        {
                            this.state.link ? 
                            <Link className="msg-link" 
                                to={this.state.link}>
                                Detail
                            </Link> : 
                            <span></span>
                        }
                    </span>
                </div>
            </div>
        );
    }
}

export default NotificationCard;
