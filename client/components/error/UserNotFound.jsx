import React from 'react';

import GetNavBar from '../GetNavBar.jsx';

export class UserNotFound extends React.Component {
  constructor(props) {
    super(props);
    console.log("UserNotFound constructor called");
  }

  render() {
    console.log("Rendering UserNotFound Component");

    //Local CSS styles
    const centerText = {
      textAlign: 'center'
    };
    const centerImg = {
      display: 'block',
      margin: 'auto'
    };
    const divStyle = {
      margin: '80px 0px 80px 0px'
    };
    const translateStyle = {
      transform: 'translate3d(0px, 0px, 0px)'
    };
    const whiteBg = {
      backgroundColor: 'white',
      borderRadius: '40px',
      margin: '5px 30px 5px 30px'
    };

    return (
      <div>
        <header id="" className="intro-block">
            <div className="container">
                <div className="thumbnail" style={whiteBg}>
                  <div style={divStyle}>
                    <img style={centerImg} src="http://cdnjs.cloudflare.com/ajax/libs/twemoji/2.2.0/2/svg/1f62d.svg"
                    height="180" width="180" />
                    <h2 style={centerText}>Sorry, the user you requested does not exist.</h2>
                  </div>
                </div>
            </div>
  	    <div className="block-bg" data-stellar-ratio="0.4" style={translateStyle}></div>
        </header>
      </div>
    );
  }
}
