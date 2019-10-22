import React from 'react';
import Navbar from "../Navbar.jsx";
import "../../stylesheets/UserProfiling.scss";

// const log = console.log;

class UserProfiling extends React.Component {


    render(){
        return (
            <div id="UserProfiling">
                <Navbar />
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
                    <h2>University of Toronto</h2>
                    <p>@UofT</p>
                    <p>
                        Connect with Canada's top university and one of the world’s strongest academic and research
                        powerhouses. Find the latest news & events @uoftnews. #UofT
                    </p>
                </div>
                <img id="bigProfilePicCircle" src={process.env.PUBLIC_URL + "./img/User_Avatar.png"} alt="ProfilePicture"/>
            </div>
        )
    }
}

export default UserProfiling;