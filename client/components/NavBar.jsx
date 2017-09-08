import React from 'react';

export class NavBar extends React.Component {
    // See: https://facebook.github.io/react/docs/forms.html
    // Note: the constuctor is only called the first time the component renders,
    // not when the component gets re-rendered
    constructor(props) {
        super(props);
	console.log('NavBar constructor() called. Props:', this.props);
    }

    /*
      componentWillReceiveProps(nextProps) {
      this.setState(nextProps);
      }
      
      componentDidUpdate(prevProps, prevState) {
      console.log("NavBar componentDidUpdate. Props: ", this.props);
      }
    */

    render() {

	var userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + this.props.user;
        var userProfileUrl = "http://aquaint.us/" + this.props.user;

	// If user exists, display username in upper right corner and picture!
	if (this.props.user) {
            return (
		<nav className="navbar navbar-fixed-top">
		  <div className="container_fluid">
		    <a className="navbar-brand goto" href="/"> <img src="./images/logo.svg" alt="Your logo" height="38" width="152" /> </a>
                    <ul className="nav">
                      <li><a href={userProfileUrl}>{this.props.user}</a> </li>
		      <li><a onClick={this.props.onSignoutClick}>Sign out</a> </li>
                    </ul>
                    <a className="navbar-user-image" href={userProfileUrl}>
                      <img src={userImage} alt="Your username" className="img-circle" height="38" width="38" />
                    </a>
		  </div>
		</nav>
            );
	} else { // Display default
            return (
		<nav className="navbar navbar-fixed-top">
		  <div className="container_fluid">
		    <a className="navbar-brand goto" href="/"> <img src="./images/logo.svg" alt="Your logo" height="38" width="152" /> </a>
		    <a className="contact-btn icon-envelope" data-toggle="modal" data-target="#modalContact"></a>
		    <button className="navbar-toggle menu-collapse-btn collapsed" data-toggle="collapse" data-target=".navMenuCollapse"> <span className="icon-bar"></span> <span className="icon-bar"></span> <span className="icon-bar"></span> </button>
		    <div className="collapse navbar-collapse navMenuCollapse">
                      <ul className="nav">
			{/*
			<li><a href="#Aquaint">{this.props.user}</a> </li>
			<li><a href="#getAquainted">Aquaint Code</a> </li>
			<li><a href="#features">Aqualytics</a></li>
			<li><a href="#social">Stay tuned</a></li>
			<li><a href="http://www.blog.aquaint.us">Blog</a> </li>
			*/}
                      </ul>
		    </div>
		  </div>
		</nav>
            );
	}
    }
}
