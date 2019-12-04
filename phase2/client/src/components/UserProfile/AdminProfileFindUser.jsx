import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

class AdminProfileFindUser extends React.Component {
  _isMount = true;

  state = {
    id: "",
    avatar: process.env.PUBLIC_URL + "./img/User_Avatar.png",
    username: "",
    email: "",
    motto: "",
    banned: false,
    unbanned_date: -1,

    inputuser: "",
    inputmsg: ""
  };
  // Objects that may not visible depend on the post status.
  tempElements = {
    display_user: null,
    display_banned: null,
    button_ban: null
  };

  // Input Change handler.
  handleInputChange = event => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if (this._isMount) {
      this.setState({ [name]: value });
    }
  };

  // Show the user found.
  showUser = () => {
    if (this._isMount) {
      this.setState({ inputmsg: "" });
    }
    this.tempElements.display_user.removeAttribute("hidden");
    if (this.state.banned) {
      this.tempElements.display_banned.removeAttribute("hidden");
      this.tempElements.button_ban.innerHTML = "Unban";
    } else {
      this.tempElements.display_banned.setAttribute("hidden", true);
      this.tempElements.button_ban.innerHTML = "Ban";
    }
  };

  // Hide the user object when appropriate.
  hideUser = () => {
    this.tempElements.display_user.setAttribute("hidden", true);
    alert("This user does not exist.");
  };

  // Read user from server.
  getUserInfo = e => {
    e.preventDefault();
    if (this.state.inputuser.length < 4) {
      alert("Invalid username.");
    } else {
      axios
        .get(`/api/users/username/${this.state.inputuser}`, this.tokenConfig())
        .then(user => {
          if (!user || user.data.length === 0 || user.data[0].admin) {
            this.hideUser();
          } else {
            const curUser = user.data[0];
            if (this._isMount) {
              this.setState({
                id: curUser._id,
                avatar: curUser.avatar,
                username: curUser.username,
                email: curUser.email,
                motto: curUser.motto,
                banned: curUser.banned,
                unbanned_date: Date.parse(curUser.unbanned_date)
              });
            }
            this.showUser();
          }
        })
        .catch(error => {
          this.hideUser();
          alert("Failed to get user.");
          console.log(error);
        });
    }
  };

  // Reset a user's motto and notify him.
  resetMotto = () => {
    const newMotto = "Welcome, new user";

    const msgBody =
      "Your motto is reset due to containing inappropriate language";
    const success = "Notified " + this.state.username;
    const fail = "Could not notify the user.";

    axios
      .patch(
        `/api/users/${this.state.id}`,
        { motto: newMotto },
        this.tokenConfig()
      )
      .then(result => {
        if (result.status === 200) {
          this.props.current_user.motto = newMotto;
          if (this._isMount) {
            this.setState({ motto: newMotto });
          }
          alert("Motto reset.");
          return true;
        } else {
          alert("Motto failed to reset.");
          return false;
        }
      })
      .then(result => {
        if (result) {
          this.sendMsgToServer(msgBody, success, fail);
        }
      })
      .catch(err => {
        alert("Motto failed to reset.");
        console.log(err);
      });
  };

  // Ban or unban a user.
  changeBan = () => {
    if (this.state.banned) {
      if (this._isMount) {
        this.setState({ banned: false });
      }
      this.tempElements.display_banned.setAttribute("hidden", true);
      this.tempElements.button_ban.innerHTML = "Ban";
    } else {
      if (this._isMount) {
        this.setState({ banned: true });
      }
      this.tempElements.display_banned.removeAttribute("hidden");
      this.tempElements.button_ban.innerHTML = "Unban";
    }
  };

  // Change the banned status to server.
  changeBanToServer = () => {
    const unbanDate = Date.now() + 1000 * 60 * 60 * 24 * 5;
    axios
      .patch(
        `/api/users/ban/${this.state.id}`,
        {
          banned: !this.state.banned,
          unbanned_date: unbanDate
        },
        this.tokenConfig()
      )
      .then(result => {
        console.log(result.data);
        if (result.status === 200) {
          if (this._isMount) {
            this.setState({ unbanned_date: unbanDate });
          }
          this.changeBan();
        } else {
          alert("Failed to ban the user.");
        }
      })
      .catch(err => {
        alert("Failed to ban the user.");
        console.log(err);
      });
  };

  // Permanently delete a post.
  permDelete = () => {
    axios
      .delete("/api/users/" + this.state.id, this.tokenConfig())
      .then(res => {
        this.tempElements.display_user.setAttribute("hidden", true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  sendMsg = e => {
    e.preventDefault();
    if (this.state.inputmsg.length === 0) {
      alert("A message must have some contant.");
    } else {
      this.sendMsgToServer(
        this.state.inputmsg,
        "Message sent.",
        "Message failed to send."
      );
    }
  };

  // Send a notification to server.
  sendMsgToServer = (msgBody, success, fail) => {
    const newMsg = {
      from: this.props.current_user._id,
      to: this.state.id,
      body: msgBody
    };

    axios
      .post(`/api/notifications/create`, newMsg, this.tokenConfig())
      .then(msg => {
        if (!msg) {
          alert(fail);
        } else {
          alert(success);
        }
      })
      .catch(err => {
        alert(fail);
        console.log(err);
      });
  };

  tokenConfig = () => {
    // Get token from localstorage
    const token = this.props.auth.token;

    // Headers
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    // If token, add to headers
    if (token) {
      config.headers["x-auth-token"] = token;
    } else {
      window.location.href = "/";
    }

    return config;
  };

  componentDidMount() {
    this._isMount = true;
    this.tempElements.display_user = document.getElementById("display-user");
    this.tempElements.display_user.setAttribute("hidden", true);

    this.tempElements.display_banned = document.getElementById("ban-warning");
    this.tempElements.display_banned.setAttribute("hidden", true);

    this.tempElements.button_ban = document.getElementById("button-ban");
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  render() {
    return (
      <div id="finduser">
        <form id="search-user">
          <p>Find user by username:</p>
          <input
            type="text"
            id="user-id-input"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
            name="inputuser"
            value={this.state.inputuser}
            onChange={this.handleInputChange}
          />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={this.getUserInfo}
          >
            Find
          </button>
        </form>

        <div id="display-user">
          <div className="row row-info">
            <div className="col-md-8">
              <div className="row">
                <div className="col-md-4">
                  <div className="avatar-container">
                    <Link to={`/otherprofile/${this.state.id}`}>
                      <img id="user-avatar" src={this.state.avatar} alt="" />
                    </Link>
                    <h6>{this.state.username}</h6>
                  </div>
                </div>
                <div className="col-md-8">
                  <div id="text-block">
                    <p>Email: {this.state.email}</p>
                    <p>Motto: {this.state.motto}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <button
                type="button"
                id="button-reset"
                className="btn btn-secondary"
                onClick={this.resetMotto}
              >
                Reset Motto
              </button>
            </div>
          </div>

          <div className="row row-ban mb-5">
            <div className="col-md-8">
              <div id="ban-warning">
                {/* <h6>
                  Will be unbanned in
                  {Math.ceil((this.state.unbanned_date - Date.now()) / (1000 * 60 * 60 * 24))} days.
                </h6> */}
              </div>
              {this.state.banned ? (
                <h6 id="banned-msg">
                  {"Will be unbanned in " +
                    Math.ceil(
                      (this.state.unbanned_date - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    ) +
                    " days."}
                </h6>
              ) : (
                <h5 id="not-banned-msg">Click Ban to Ban User</h5>
              )}
            </div>
            <div className="col-md-4">
              <button
                type="button"
                id="button-ban"
                className="btn btn-danger"
                onClick={this.changeBanToServer}
              >
                Ban
              </button>
              <button
                type="button"
                id="button-delete"
                className="btn btn-danger"
                onClick={this.permDelete}
              >
                Delete
              </button>
            </div>
          </div>

          <form action="">
            <div className="row row-msg">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  name="inputmsg"
                  value={this.state.inputmsg}
                  onChange={this.handleInputChange}
                  placeholder="Enter Message"
                />
              </div>
              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-info"
                  onClick={this.sendMsg}
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

// getting from reducers (error and auth reducers)
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  current_user: state.auth.user,
  auth: state.auth
});

export default connect(mapStateToProps)(AdminProfileFindUser);
