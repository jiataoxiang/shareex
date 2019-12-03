import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

class AdminProfileDashboard extends React.Component {
    state = {
        totalUsers: -1,
        totalPosts: -1,
        dailyComments: -1,
        dailyPosts: -1
    };

    // Get number of users excluding admins.
    getTotalUsers = () => {
        axios.get(
            `/api/users/countusers`, this.tokenConfig()
        ).then(result => {
            if (result && result.data.count) {
                this.setState({ totalUsers: result.data.count });
            } else {
                this.setState({ dailyComments: 0 });
            }
        }).catch(error => {
            console.log(error);
        });
    }
    
    // Get number of posts.
    getTotalPosts = () => {
        axios.get(
            `/api/posts/countposts`, this.tokenConfig()
        ).then(result => {
            if (result && result.data.count) {
                this.setState({ totalPosts: result.data.count });
            } else {
                this.setState({ dailyComments: 0 });
            }
        }).catch(error => {
            console.log(error);
        });
    }
    
    // Get number of comments in the last 24 hours.
    getDailyComments = () => {
        axios.get(
            `/api/comments/countdaily`, this.tokenConfig()
        ).then(result => {
            if (result && result.data.count) {
                this.setState({ dailyComments: result.data.count });
            } else {
                this.setState({ dailyComments: 0 });
            }
        }).catch(error => {
            console.log(error);
        });
    }
    
    // Get number of posts in the last 24 hours.
    getDailyPosts = () => {
        axios.get(
            `/api/posts/countdaily`, this.tokenConfig()
        ).then(result => {
            if (result && result.data.count) {
                this.setState({ dailyPosts: result.data.count });
            } else {
                this.setState({ dailyComments: 0 });
            }
        }).catch(error => {
            console.log(error);
        });
    }
    
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
        this.getTotalUsers();
        this.getTotalPosts();
        this.getDailyComments();
        this.getDailyPosts();
    }
    
    render() {
        return (
            <div className="dashboard">
                <div className="row">
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Users:</h5>
                                <p className="">{this.state.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Total Posts:</h5>
                                <p className="">{this.state.totalPosts}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Daily Comments:</h5>
                                <p className="">{this.state.dailyComments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Daily Posts:</h5>
                                <p className="">{this.state.dailyPosts}</p>
                            </div>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(AdminProfileDashboard);
