import React from 'react';
// import Navbar from "../Navbar.jsx";
import "../../stylesheets/UserProfiling.scss";
import Post from "../Post";

// const log = console.log;

class UserProfiling extends React.Component {


    render(){
        return (
            <div className="UserProfiling">
                <div id="banner">
                    <img className="bannerPic" src={process.env.PUBLIC_URL + "./img/banner.jpg"} alt="Banner"/>
                </div>
                <div id="profileStats">
                    <ul>
                        <li>Tweets<br/><span className="profileStatsNumber">478</span></li>
                        <li>Followers<br/><span className="profileStatsNumber">23K</span></li>
                        <li>Following<br/><span className="profileStatsNumber">12</span></li>
                        <li>Likes<br/><span className="profileStatsNumber">10.3K</span></li>
                    </ul>
                </div>
                <div id="profileInfo">
                    <h2>Name: super JATO</h2>
                    <p>Skill: hahahahaha</p>
                    <p>I'm powerful</p>
                    <p>
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事，讲的内容是：
                        从前有座山，山里有座庙，庙里有个小和尚在讲故事。
                    </p>
                </div>
                <div className="timeline">
                    <div className="post">
                        <h3 className="timelineheader">Posts</h3>
                        <Post />
                        <Post />
                    </div>
                </div>
                <img id="bigProfilePicCircle" src={process.env.PUBLIC_URL + "./img/User_Avatar.png"} alt="ProfilePicture"/>
            </div>
        )
    }
}

export default UserProfiling;