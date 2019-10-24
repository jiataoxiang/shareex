import React from "react";
import Home from "./components/Homepage/Home";
import UserProfile from "./components/UserProfile/UserProfile";
import Login from "./components/Login/Login";
import SignUp from "./components/Signup/SignUp";
import NewPost from "./components/NewPost/NewPost";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import NotFound404 from "./components/404";
import SinglePost from "./components/SinglePost/SinglePost";
import Navbar from "./components/Navbar";
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
          <Route exact path="/single_post" component={SinglePost} />
          <Route component={NotFound404} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
