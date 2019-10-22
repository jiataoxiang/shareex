import React from "react";
import "./App.css";
import Home from "./components/Homepage/Home";
import Signin from "./components/SignIn/Signin";
import UserProfiling from "./components/UserProfiling/UserProfiling";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import NotFound404 from "./components/404";

function App() {
  return (
    <div>
      {/* <Hometest /> */}
      <BrowserRouter>
        <Switch>
          {" "}
          {/* Similar to a switch statement - shows the component depending on the URL path */}
          {/* Each Route below shows a different component depending on the exact path in the URL  */}
          <Route exact path="/" component={Home} />
          <Route exact path="/signin" component={Signin} />
          <Route exact path="/userprofiling" component={UserProfiling} />
          <Route component={NotFound404} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
