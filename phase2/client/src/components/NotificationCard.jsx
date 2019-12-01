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
        time: null,
        read: true
    };

    checkDetail = () => {
        alert("wtf")
    }

    componentDidMount() {
        const msg = this.props.msg;
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
                time: msg.time,
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
                time: msg.time,
                read: msg.read
            });
        }
    }

    render() {
        return (
            <div className="notification-card media border rounded">
                <div className="mr-3">
                    <img className="avatar" src={this.state.avatar} alt="" />
                    <h6>{this.state.username}</h6>
                </div>
                <div className="media-body">
                    {this.state.body}
                    <Link to={this.state.link}>wtf</Link>
                </div>
            </div>
        );
    }
}

export default NotificationCard;
