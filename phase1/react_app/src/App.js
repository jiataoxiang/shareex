import React from "react";
import "./App.css";
import Home from "./components/Home.jsx";
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
          <Route component={NotFound404} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
