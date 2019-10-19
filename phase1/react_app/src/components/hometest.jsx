import React from "react";
import { Link } from "react-router-dom";

/* Component for the Home page */

class Hometest extends React.Component {
  render() {
    return (
      <Link to={"./home"}>
        {" "}
        {/* This element will link the URL path to /queue */}
        <button>Go to Home Page</button>
      </Link>
    );
  }
}

export default Hometest;
