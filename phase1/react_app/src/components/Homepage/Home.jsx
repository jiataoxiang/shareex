import React, { Component } from "react";
import Post from "../Post";
import "../../stylesheets/home.scss";
import { lorem, rand_string } from "../../lib/util";

class Home extends Component {
  state = {};

  componentDidMount() {}

  render() {
    const rand_images = [];
    for (let j = 0; j < 2; j++) {
      const tmp = [];
      for (let i = 0; i < 5; i++) {
        tmp.push("https://picsum.photos/seed/" + rand_string() + "/200/300");
      }
      rand_images.push(tmp);
    }

    return (
      <div className="home-page">
        <div className="container row">
          <div className="posts col-12 col-sm-6 col-md-8">
            <h3>Posts</h3>
            <Post
              title={lorem.generateSentences(1)}
              content={lorem.generateParagraphs(2)}
              images={rand_images[0]}
            />
            <Post
              title={lorem.generateSentences(1)}
              content={lorem.generateParagraphs(2)}
              images={rand_images[1]}
            />
          </div>
          <div className="recommendations col-6 col-md-4">
            <h4>Recommendations</h4>
            <ul className="list-group">
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
              <li className="list-group-item">
                <a href="/"> Recommendation </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
