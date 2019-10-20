import React, { Component } from "react";
import Navbar from "../Navbar.jsx";
import "../../stylesheets/SinglePost.css"

class SinglePost extends Component {
    state = {};
    componentDidMount() {}
    render() {
        return (
            <div>
                <Navbar />
                <div id={"brief"}>
                    {/*The title of the post*/}
                    <h2>Field Trip</h2>
                    <div>
                        <ul className="list-group list-group-flush" id={"description"}>
                            <li className="list-group-item">Author: Bill Gates</li>
                            <li className="list-group-item">Location: US</li>
                            <li className="list-group-item">Likes: 666</li>
                        </ul>
                    </div>

                </div>
                <div>
                    <div id={"content"}>
                        <textarea>Hello from the other side....</textarea>
                    </div>
                    <div id={"comment"}>
                        <div className="card-body">
                    </div>
                </div>
            </div>
        );
    }
}

export default SinglePost;
