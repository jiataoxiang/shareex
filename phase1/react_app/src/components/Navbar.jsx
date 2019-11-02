import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/navbar.scss";
import $ from "jquery";

class Navbar extends React.Component {
  state = {};
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $(document).ready(function() {
      // Get click event, assign button to var, and get values from that var
      $("#theme-btn-group button").on("click", function() {
        const btn_clicked = $(this);
        btn_clicked
          .addClass("active")
          .siblings()
          .removeClass("active");
        var btnValue = btn_clicked.val();
        // console.log("Color theme - ", btnValue);

        if (btnValue === "light") {
          trans();
          document.documentElement.setAttribute("theme", "light");
          $(".btn-light")
            .removeClass("btn-light")
            .addClass("btn-primary");
        } else if (btnValue === "dark") {
          trans();
          document.documentElement.setAttribute("theme", "dark");
          $(".btn-primary")
            .removeClass("btn-primary")
            .addClass("btn-light");
        }
      });
      let trans = () => {
        document.documentElement.classList.add("transition");
        // $("*").addClass("transition");
        window.setTimeout(() => {
          document.documentElement.classList.remove("transition");
          // $("*").removeClass("transition");
        }, 760);
      };
    });
  }

  /* if signed in, display user profile button, 
      else, return sign in sign up buttons */
  getButton = () => {
    if (this.props.val.current_user) {
      return (
        <Link to="/userprofile">
          <img
            src={process.env.PUBLIC_URL + "./img/user_profile_icon.png"}
            alt=""
            width="40px"
            height="40px"
          />
        </Link>
      );
    } else {
      return (
        <div className="btn-group">
          <Link to="/login">
            <button className="btn btn-primary btn-sm">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-success btn-sm">Sign Up</button>
          </Link>
        </div>
      );
    }
  };

  render() {
    // console.log(this.props.val);
    return (
      <nav className="navbar-page navbar navbar-expand-lg navbar-dark bg-dark">
        <Link id="logo-btn" to="/">
          <img
            src={process.env.PUBLIC_URL + "./img/logo_S.png"}
            alt=""
            width="50px"
          />
          <span id="shareEx-logo-text">ShareEx</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            {/* <li className="nav-item active">
              <form className="form-inline my-2 my-lg-0">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="/"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Category
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/">
                  Computer Science
                </a>
                <a className="dropdown-item" href="/">
                  Education
                </a>
                <a className="dropdown-item" href="/">
                  Technology
                </a>
                <a className="dropdown-item" href="/">
                  Travel
                </a>
              </div>
            </li> */}
          </ul>
          <Link className="nav-link nav-item" to="new_post">
            <button className="btn btn-outline-primary">New Post</button>
          </Link>
          <div
            id="theme-btn-group"
            className="btn-group"
            role="group"
            aria-label="..."
          >
            <button className="btn btn-light btn-sm" value="light" checked>
              Light
            </button>
            <button className="btn btn-dark btn-sm" value="dark">
              Dark
            </button>
          </div>

          {this.getButton()}
        </div>
      </nav>
    );
  }
}

export default Navbar;
