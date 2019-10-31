import React, { Component } from "react";
import "../../stylesheets/single_post.scss";

class SinglePost extends Component {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="single-page">
        <div className="row">
          <div className="col-8">
            <div className="content-comment">
              <div id="content">
                <section className="the-post">
                  <article className="article">
                    <h1>Programmers can't feel cold.</h1>
                    <div className="split-line"></div>

                    <div className="counts">
                      <span>Viewed: 999</span>
                      <span>Liked: 999</span>
                    </div>
                    <img
                      src={process.env.PUBLIC_URL + "./img/saitama.jpg"}
                      className="content-img"
                      alt=""
                    ></img>
                    <p>
                      Hello from the other side... Hello from the other
                      side....Hello from the other side...Hello from the other
                      side...Hello from the other side...Hello from the other
                      side...
                    </p>
                    <p>Hello from the other side....</p>
                    <p>Hello from the other side....</p>
                    <p>Hello from the other side....</p>
                    <p>Hello from the other side....</p>
                    <p>Hello from the other side....</p>
                  </article>
                </section>
              </div>

              <section className="comment-part">
                <div className="write-comment">
                  <div id="comment-box">
                    <textarea placeholder="comment"></textarea>
                    <div className="input-group-append" id="button-addon4">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="comments">
                  <div>
                    <img
                      className="comment-avatar"
                      alt=""
                      src={process.env.PUBLIC_URL + "./img/saitama.jpg"}
                    ></img>
                    <div className="author-and-date">
                      <div className="comment-title">
                        <b>Mr. Saitama</b>
                      </div>
                      <div className="comment-date">
                        <time dateTime="2019-02-25T03:19:23.000Z">
                          Last modified date 02.24 22:19
                        </time>
                      </div>
                    </div>
                  </div>
                  <div className="split-line"></div>
                  <div className="one-comment">
                    <div className="comment-content">
                      My first comment. Voluptate quis ullamco et eiusmod nulla
                      nostrud id do. Veniam occaecat occaecat officia minim
                      voluptate. Eiusmod mollit enim. Adipisicing voluptate
                      enim. Incididunt ut ut magna amet id anim enim ea. Aute
                      dolor ipsum cupidatat deserunt esse enim ad magna.
                      Excepteur sint et eiusmod eu minim dolor tempor eiusmod
                      mollit. Reprehenderit amet aute nulla et minim. Enim id
                      nostrud proident qui enim. Eiusmod occaecat ex esse
                      nostrud. Minim tempor commodo. Ipsum Lorem ullamco
                      adipisicing id.
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="col-4">
            <div className="brief">
              <section className="info">
                <a href="/userprofile" className="author-link">
                  <img
                    src={process.env.PUBLIC_URL + "./img/peppa.jpeg"}
                    alt=""
                    className="rounded-circle"
                  />
                </a>
                <div className="author-info">
                  <div className="description">
                    <span>
                      <b>Peppa Pig</b>
                    </span>
                  </div>
                  <div className="description">Mars, Solar System</div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SinglePost;
