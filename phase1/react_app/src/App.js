import React from "react";
import Home from "./components/Homepage/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/SignUp";
import NewPost from "./components/NewPost/NewPost";
import NotFound404 from "./components/404";
import SinglePost from "./components/SinglePost/SinglePost";
import ProfSetting from "./components/prof_set/prof_set";
import Navbar from "./components/Navbar";
import Tmp from "./components/Tmp";
// import { rand_string } from "./lib/util";
// import { uid } from "react-uid";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import mock_data from "./mock_data";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

// function App() {
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      users: mock_data.users,
      posts: mock_data.posts,
      comments: mock_data.comments,
      attachments: mock_data.attachments,
      current_user: mock_data.current_user,
      current_post: mock_data.current_post
    });
    console.log(this.state);
  }

  render() {
    console.log(this.state);

    return (
      <div>
        {/* <Hometest /> */}
        <BrowserRouter>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/index.html" component={Home} />
            <Route exact path="/userprofile" component={UserProfile} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/new_post" component={NewPost} />
            <Route exact path="/single_post" component={SinglePost} />
            <Route exact path="/prof_setting" component={ProfSetting} />
            <Route exact path="/tmp" component={Tmp} />
            <Route component={NotFound404} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
