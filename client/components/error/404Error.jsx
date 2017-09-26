import React from 'react';

import GetNavBar from '../GetNavBar.jsx';

export class Error404 extends React.Component {
    constructor(props) {
        super(props);
        console.log('Error404 constructor called');
    }

    render() {
        console.log('Rendering Error404 Component');

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

        return(
            <div>
                <GetNavBar />
                <header id="" className="intro-block">
                    <div className="container">
                        <div className="thumbnail" style={whiteBg}>
                            <div style={divStyle}>
                                <h2 style={centerText}>404</h2>
                                <h2 style={centerText}>Sorry, the page you are looking for doesn't exist.</h2>
                            </div>
                        </div>
                    </div>
                    <div className="block-bg" data-stellar-ratio="0.4" style={translateStyle}></div>
                </header>
            </div>
        );
    }
}
