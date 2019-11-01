import React from "react";
import Home from "./components/Homepage/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/SignUp";
import NewPost from "./components/NewPost/NewPost";
import NewPost2 from "./components/NewPost/NewPost2";
import NotFound404 from "./components/404";
import SinglePost from "./components/SinglePost/SinglePost";
import SinglePost2 from "./components/SinglePost/SinglePost2";
import ProfSetting from "./components/prof_set/prof_set";
import Navbar from "./components/Navbar";
import Tmp from "./components/Tmp";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  return (
    <div>
      {/* <Hometest /> */}
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/userprofile" component={UserProfile} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/new_post" component={NewPost} />
          <Route exact path="/new_post2" component={NewPost2} />
          <Route exact path="/single_post" component={SinglePost} />
          <Route exact path="/single_post2" component={SinglePost2} />
          <Route exact path="/prof_setting" component={ProfSetting} />
          <Route exact path="/tmp" component={Tmp} />
          <Route component={NotFound404} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
