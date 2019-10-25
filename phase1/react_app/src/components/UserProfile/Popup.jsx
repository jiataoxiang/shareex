import React from 'react';

class Popup extends React.Component {

  saveHandler = () => {
    console.log("saved!!!")
  };

  render() {
    return (
      <div className='popupWindow'>
        <div className='popupInner'>
          <h1>{this.props.header}</h1>
          <br/><br/>
          <input
            type="file"
            className="form-control-file border"
            id={"file"}
          />
          <br/>
          <button id="saveButton" onClick={this.saveHandler}>save</button>
        </div>
        <button id="closeButton" onClick={this.props.closePopup}>close</button>
      </div>
    );
  }
}

export default Popup;