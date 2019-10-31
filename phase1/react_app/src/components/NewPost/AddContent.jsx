import React, { Component } from "react";

class AddContent extends Component {
  state = {};
  render() {
    return (
      <div className="add-content">
        <img
          className="add-icon float-right"
          type="button"
          src={process.env.PUBLIC_URL + "/icon/add_icon.png"}
          alt=""
        />
      </div>
    );
  }
}

export default AddContent;
