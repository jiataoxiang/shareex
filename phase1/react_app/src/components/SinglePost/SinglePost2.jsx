import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../stylesheets/single_post_2.scss";

class SinglePost2 extends Component {
  state = {};
  render() {
    return (
      <div className="single-post-2-page">
        <div className="container">
          <div className="row">
            <div className="single-post-container col-12 col-md-9">
              <div className="single-post">
                <h3>
                  How to deploy Nodejs Web app on AWS EC2, with SSL certificate
                </h3>
                <div className="post-content">
                  <iframe
                    width="100%"
                    height="400"
                    title="video"
                    src="https://www.youtube.com/embed/dMVy3BQB314"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                  <img
                    src={process.env.PUBLIC_URL + "/images/SSL.png"}
                    alt=""
                  />
                  <embed
                    className="pdf"
                    src={
                      process.env.PUBLIC_URL +
                      "/files/AWS_Deploy_web_app_with_SSL.pdf"
                    }
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  />
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                  <img
                    src="https://chiefit.me/wp-content/uploads/2019/06/Amazon-Web-Services_logo835x396.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div
              to="/userprofile"
              className="user-info-container col-12 col-6 col-md-3"
            >
              <div className="sticky-top">
                <div className="space"></div>
                <Link to="/userprofile">
                  <div className="user-info">
                    <div className="row">
                      <div className="col-lg-3 col-3">
                        <img
                          className="avatar"
                          src={process.env.PUBLIC_URL + "/img/saitama.jpg"}
                          alt=""
                        />
                      </div>
                      <div className="col-lg-9 col-9">
                        <strong>Username</strong>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            >
          </div>
        </div>
      </div>
    );
  }
}

export default SinglePost2;
