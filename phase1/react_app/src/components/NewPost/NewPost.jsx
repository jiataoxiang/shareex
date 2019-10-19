import React, { Component } from "react";
import Navbar from "../Navbar.jsx";
import PostContent from "./PostContent";
import "../../stylesheets/NewPost.css";

class NewPost extends Component {
    state = {};
    componentDidMount() {}
    render() {
        return (
            <div id={"post"}>
                <Navbar />
                <PostContent />
            </div>
        );
    }
}

export default NewPost;
