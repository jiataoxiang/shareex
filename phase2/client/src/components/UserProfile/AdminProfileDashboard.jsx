import React from 'react';

class AdminProfileDashboard extends React.Component {
    state = {
        numVisited: -1,
        numHit: -1,
        numPosts: -1,
        numUsers: -1
    };
    
    render() {
        return (
            <div className="dashboard">
                <div className="row">
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Number Visited:</h5>
                                <p className="">{this.state.numVisited}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Number Hit:</h5>
                                <p className="">{this.state.numHit}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Number Posts:</h5>
                                <p className="">{this.state.numPosts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col stat">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Number Users:</h5>
                                <p className="">{this.state.numUsers}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminProfileDashboard;