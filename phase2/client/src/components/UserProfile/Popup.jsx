import React from 'react';

class Popup extends React.Component {


  render() {
    return (
      <div className='popupWindow'>
        <div className='popupInner'>
          <h1 className='popupHeader'>{this.props.header}</h1>
          <br/><br/>
          <br/>
          <br/>
          <br/>
          <button id="closeButton" onClick={this.props.closePopup}>close</button>
        </div>
      </div>
    );
  }
}

export default Popup;