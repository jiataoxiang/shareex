import React, { Component } from "react";
import Post from "../Post";
import { Link } from "react-router-dom";
// import Recommendation from "./Recommendation";
import "../../stylesheets/home.scss";
import { lorem, rand_string } from "../../lib/util";
import { uid } from "react-uid";

class Home extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const rand_images = [];
    for (let j = 0; j < 10; j++) {
      const tmp = [];
      for (let i = 0; i < 5; i++) {
        tmp.push("https://picsum.photos/seed/" + rand_string() + "/200/300");
      }
      rand_images.push(tmp);
    }

    // Construct recommendation list
    // In phase 2, should get title and href from server api
    const recommendations = [];
    for (let i = 0; i < 10; i++) {
      recommendations.push(
        <li key={uid(rand_string())} className="list-group-item">
          <Link to="/">
            <a href="/"> {lorem.generateSentences(1)} </a>
          </Link>
        </li>
      );
    }

    // Construct Post list
    // In phase 2, data should come from server api
    const posts = [];
    for (let i = 0; i < 5; i++) {
      posts.push(
        <Post
          key={uid(rand_string())}
          title={lorem.generateSentences(1)}
          content={lorem.generateParagraphs(2)}
          images={rand_images[i]}
        />
      );
    }

    return (
      <div className="home-page">
        <div className="container row">
          <div className="posts col-12 col-sm-6 col-md-8">
            <h3>Posts</h3>
            {posts}
          </div>
          <div className="recommendations col-12 col-6 col-md-4">
            <div className="sticky-top">
              <h3>Recommendations</h3>
              <ul className="list-group">{recommendations}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
