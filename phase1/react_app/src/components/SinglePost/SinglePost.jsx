import React, {Component} from "react";
import "../../stylesheets/single_post.scss";

class SinglePost extends Component {
    state = {};

    componentDidMount() {
    }

    render() {
        return (
            <div className="single-page">
                <aside className="brief">
                    <section className="info">
                        <div className="description">Author: Newton Wang</div>
                        <div className="split-line"></div>
                        <div className="description">Location: Mars, Solar System</div>
                    </section>
                </aside>
                <div className="content-comment">
                    <div id="content">
                        <section className="the-post">
                            <article className="article">

                                <h1>Programmers can't feel cold.</h1>

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
                            <img className="user-avatar" src={process.env.PUBLIC_URL + "./img/saitama.jpg"}></img>
                            <div id="comment-box">
                                <textarea placeholder="comment"></textarea>
                                <div className="input-group-append" id="button-addon4">
                                    <button className="btn btn-outline-secondary" type="button">Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="comments">
                            <div className="one-comment">
                                First comment here. 
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default SinglePost;
