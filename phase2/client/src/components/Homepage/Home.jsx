import React, { Component } from "react";
import Post from "../Post";
import { Link } from "react-router-dom";
import "../../stylesheets/home.scss";
import { rand_string } from "../../lib/util";
import { uid } from "react-uid";

class Home extends Component {
  state = {
    posts: [],
    recommendations: []
  };

  // the following code is for getting all posts to be displayed on home page
  getPosts = () => {
    // Get posts from server
    // code below requires server call
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
            users={this.props.state.users}
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
  // getRecommendations() returns the recommendations to be displayed on home page
  getRecommendations = () => {
    // Get posts from server
    // code below requires server call
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
