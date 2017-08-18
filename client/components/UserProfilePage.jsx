import React from 'react';
import ReactDOM from 'react-dom';
import GetNavBar from './GetNavBar.jsx'; 

export class UserProfilePage extends React.Component {
    constructor(props) {
	super(props);
    }
    
    render() {
	// TODO: the user authentication state should be passed from IndexPage to UserSignupPage to NavBar
	// each should have read/write ability
	/*
	let auth_username = (
	    this.props.location.userSignupFormState != null && this.props.location.userSignupFormState.isAuthorized) ?
	    this.props.params.userSignupFormState.username : '';
	
	console.log("UserProfilePage props: ", this.props);
	console.log(`User page URI: ${this.props.location.pathname}; authenticated user if any: ${auth_username}`);
	*/
	return (
	    <div>
	      <GetNavBar />

	      <header id="full-intro" className="intro-block">
		<div className="container">
		  <div className="row">
		    <div className="col-md-4 col-sm-12">

		      <p>
			Welcome to your profile page, <br/>{this.props.match.params.username}!
		      </p>
		      
		    </div>
		  </div>
		</div>
	      </header>
	    </div>
	);
    }
}
