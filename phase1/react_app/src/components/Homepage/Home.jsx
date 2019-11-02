import React, { Component } from "react";
import Post from "../Post";
import { Link } from "react-router-dom";
// import Recommendation from "./Recommendation";
import "../../stylesheets/home.scss";
import { lorem, rand_string } from "../../lib/util";
import { uid } from "react-uid";

class Home extends Component {
  state = {
    posts: [],
    recommendations: []
  };

  componentDidMount() {
    // The code below are temporary code for randomly generating some post content and recommendations
    // TODO: replace the following initialization code in phase 2, connect to server and get real data
    const posts = [];
    const recommendations = [];
    function getRandomImages(num) {
      const tmp = [];
      for (let i = 0; i < num; i++) {
        tmp.push("https://picsum.photos/seed/" + rand_string() + "/200/300");
      }
      return tmp;
    }

    for (let i = 0; i < 10; i++) {
      posts.push({
        title: lorem.generateSentences(1),
        content: lorem.generateParagraphs(2),
        images: getRandomImages(5),
        link: "/single_post"
      });
    }

    for (let i = 0; i < 10; i++) {
      recommendations.push({
        href: "/",
        content: lorem.generateSentences(1)
      });
    }

    this.setState({
      // posts: this.props.state.posts,
      posts: posts,
      recommendations: recommendations
    });
  }

  getPosts = () => {
    const posts = this.props.state.posts;
    const posts_display = [];
    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        posts_display.push(
          <Post
            key={uid(rand_string())}
            title={posts[i].title}
            content={posts[i].content}
            images={[]}
            link={"/"}
          />
        );
      }
    }
    return posts_display;
  };

  testbtn = () => {
    const posts = this.props.state.posts;
    posts[0].content = "edited content";
    this.props.state.setAppState("posts", posts);
  };

  render() {
    // console.log(this.props.state.posts);
    const posts = this.props.state.posts;
    console.log(posts);
    return (
      <div className="home-page">
        <div className="container row">
          <div className="posts col-12 col-sm-6 col-md-8">
            <h3>Posts</h3>
            {/* {this.state.posts.map(post => {
              return (
                <Post
                  key={uid(rand_string())}
                  title={post.title}
                  content={post.content}
                  images={post.images}
                  link={post.link}
                />
              );
            })} */}

            {this.getPosts().map(post => {
              return post;
            })}
          </div>
          <div className="recommendations col-12 col-6 col-md-4">
            <div className="sticky-top">
              <h3>Recommendations</h3>
              <ul className="list-group">
                {this.state.recommendations.map(recommendation => {
                  return (
                    <li key={uid(rand_string())} className="list-group-item">
                      <Link to={recommendation.href}>
                        {recommendation.content}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
