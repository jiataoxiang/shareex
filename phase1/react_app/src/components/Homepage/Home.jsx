import React, { Component } from "react";
import Post from "../Post";
import { Link } from "react-router-dom";
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
        // find all attachments
        const attachments = this.props.state.attachments.filter(
          attachment => attachment.post_id === posts[i].id
        );
        posts_display.push(
          <Post
            key={posts[i].id}
            post={posts[i]}
            posts={posts}
            attachments={attachments}
            current_user={this.props.state.current_user}
            setAppState={this.props.state.setAppState}
          />
        );
      }
    }
    return posts_display;
  };

  /* Recommendations are selected as those posts with more than 10 likes
    Only at most 10 are selected randomly */
  getRecommendations = () => {
    let posts = this.props.state.posts;
    const recommendations = [];
    let count = 0;
    if (posts) {
      posts = posts.filter(post => post.likes >= 10);
      for (let i = 0; i < posts.length && count < 10; i++) {
        if (posts[i].likes >= 10) {
          recommendations.push(posts[i]);
        }
      }
    }
    return recommendations;
  };

  render() {
    return (
      <div className="home-page">
        <div className="container row">
          <div className="posts col-12 col-md-8">
            <h3>Posts</h3>
            {this.getPosts().map(post => {
              return post;
            })}
          </div>
          <div className="recommendations col-12 col-6 col-md-4">
            <div className="sticky-top">
              <h3>Recommendations</h3>
              <ul className="list-group">
                {this.getRecommendations().map(recommendation => {
                  return (
                    <li key={uid(rand_string())} className="list-group-item">
                      <Link
                        to={{
                          pathname: "/single_post",
                          state: {
                            post_id: recommendation.id
                          }
                        }}
                      >
                        {recommendation.title}
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
