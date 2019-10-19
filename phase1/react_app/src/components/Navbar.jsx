import React from "react";
import "../stylesheets/navbar.scss";
import $ from "jquery";

class Navbar extends React.Component {
  state = {};
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
        console.log("Color theme - ", btnValue);

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

        window.setTimeout(() => {
          document.documentElement.classList.remove("transition");
        }, 760);
      };
      // You can use this to set default value
      // It will fire above click event which will do the updates for you
      // $('#theme-btn-group button[value="light"]').click();
    });
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          <img
            src={process.env.PUBLIC_URL + "./img/logo_S.png"}
            alt=""
            width="50px"
          />
          Share
        </a>
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
            <li className="nav-item active">
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
            <li className="nav-item">
              <a className="nav-link" href="/">
                Link
              </a>
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
                Dropdown
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="/">
                  Action
                </a>
                <a className="dropdown-item" href="/">
                  Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="/">
                  Something else here
                </a>
              </div>
            </li>
          </ul>
          <div
            id="theme-btn-group"
            className="btn-group"
            role="group"
            aria-label="..."
          >
            <button className="btn btn-light" value="light" checked>
              Light
            </button>
            <button className="btn btn-dark" value="dark">
              Dark
            </button>
          </div>
          <div className="btn-group">
            <a href="/login">
              <button className="btn btn-primary btn-sm">Sign In</button>
            </a>
            <a href="/signup">
              <button className="btn btn-success btn-sm">Sign Up</button>
            </a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
