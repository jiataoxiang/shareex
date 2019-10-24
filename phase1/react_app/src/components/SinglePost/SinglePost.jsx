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
                    <div id="comment">
                        <div className="card-body"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SinglePost;
