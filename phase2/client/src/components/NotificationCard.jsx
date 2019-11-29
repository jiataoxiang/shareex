import React from 'react';
import '../stylesheets/notification.scss';

class NotificationCard extends React.Component {
    state = {
        _user_id: null,
        admin: false,
        avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
        nickname: null,
        username: null,
        _noti_id: "",
        body: "",
        link: "",
        type: "",
        time: null,
        read: true
    };

    componentDidMount() {
        const msg = this.props.msg;
        this.setState({ _user_id: msg._user_id,
                        admin: msg.admin,
                        avatar: msg.avatar,
                        nickname: msg.nickname,
                        username: msg.username,
                        _noti_id: msg._noti_id,
                        body: msg.body,
                        link: msg.link,
                        type: msg.type,
                        time: msg.time,
                        read: msg.read});
    }

    render() {
        return (
            <div className="notification-card media border rounded">
                <div className="mr-3">
                    <img className="avatar" src={this.state.avatar} alt="" />
                    <p>{this.state.username}</p>
                </div>
                <div className="media-body">
                    {this.state.body}
                </div>
            </div>
        );
    }
}

export default NotificationCard;
