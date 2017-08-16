import React from 'react';
import ReactDOM from 'react-dom';
import { NavBar } from './NavBar.jsx'; 

export class UserProfilePage extends React.Component {
    constructor(props) {
	super(props);
    }
    
    render() {
	let auth_username = (
	    this.props.params != null && this.props.params.indexPageState.isAuthorized) ?
	    this.props.params.indexPageState.username : '';
	
	console.log(this.props);
	console.log(`User page URI: ${this.props.location.pathname}; authenticated user if any: ${auth_username}`);
	return (
	    <div>
	      <NavBar user={auth_username} />
	      <header>
		Welcome to your profile page, {this.props.match.params.username}!
	      </header>
	    </div>
	);
    }
}
