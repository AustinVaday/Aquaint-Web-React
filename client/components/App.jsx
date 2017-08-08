import React from 'react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

export class App extends React.Component {
  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <h1>Hello World</h1>
      </div>);
  }
}

let COGNITO_REGION = 'us-east-1';
let COGNITO_IDENTITY_POOL_ID = 'us-east-1:ca5605a3-8ba9-4e60-a0ca-eae561e7c74e';
let COGNITO_USER_POOL_ID = 'us-east-1_yyImSiaeD';
let COGNITO_CLIENT_ID = '4dc7abqcmfsbi6v00765cohu8p';  // Aquaint-web client

// Initialize the Amazon Cognito credentials provider
var AWS = require('aws-sdk');
AWS.config.region = COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
});

export class UserSignupForm extends React.Component {

    // Note: instead of using a variable (or an Enum) to store currentPage,
    // it should be stored in the Component state, for possible re-rendering
    
    constructor(props) {
	super(props);
	this.state = {
	    currentPage: 0,  // 0 for first part of sign-up, 1 for second part, 2 for user login
	    email: '',
	    fullname: '',
	    username: '',
	    password: '',
	    passwordVerify: ''
	};

	this.handleChange = this.handleChange.bind(this);
	this.handleContinue = this.handleContinue.bind(this);
	this.handleSignup = this.handleSignup.bind(this);
	this.handleLogin = this.handleLogin.bind(this);
    };

    handleChange(event) {
	this.setState({[event.target.name]: event.target.value});
    };

    handleContinue(event) {
	event.preventDefault();

	console.log("Changing to next signup page...");
	// Component state must be set by setState() function for necessary
	// parts to be re-rendered
	// this.state.currentPage = 1;
	this.setState({currentPage: 1});
    };
    
    handleSignup(event) {
	event.preventDefault();

	console.log('User completes sign-up form: ' + JSON.stringify(this.state));

	if (this.state.password != this.state.passwordVerify) {
	    alert("Passwords don't match; please try again.");
	}
	// Sign up user in AWS Cognito Federated Identity
	
    };

    handleLogin(event) {
	event.preventDefault();

	this.setState({currentPage: 2});
    }

    render() {
	if (this.state.currentPage == 0) {
	    return (
		<form onSubmit={this.handleContinue}>
		  Email:
		  <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
		  Full Name:
		  <input type="text" name="fullname" value={this.state.fullname} onChange={this.handleChange}/>
		  <input type="submit" value="Continue"/>
		  <p>
		    <a href="#" onClick={this.handleLogin}>
		      Already registered? Sign in here.
		    </a>
		  </p>
		</form>
	    );
	} else if (this.state.currentPage == 1) {
	    return (
		<form onSubmit={this.handleSignup}>
		  Username:
		  <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
		  Password:
		  <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
		  Verify Password:
		  <input type="password" name="passwordVerify" value={this.state.passwordVerify} onChange={this.handleChange}/>
		  <input type="submit" value="Join Aquaint"/>
		</form>
	    );
	} else if (this.state.currentPage == 2) {
	    return (
		<UserLoginForm />
	    );
	}
	return null;
    };	
}

export class UserLoginForm extends React.Component {
    // Make the form to be "Controlled Components"
    // that is, making the React state be the "single source of truth"
    // See: https://facebook.github.io/react/docs/forms.html
    constructor(props) {
	super(props);
	this.state = {
	    username: '',
	    password: ''
	};
	
	// Resolve error of "Cannot read property 'setState' of undefined"
	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
	// Update React state when the form's input changes
	// For example, when user types 'a' into the password field
	// event.target.name = password, and event.target.value = a
	this.setState({[event.target.name]: event.target.value});
    }
    
    handleSubmit(event) {
	console.log('User tried to log in: ' + this.state.username + '; ' + this.state.password);
	// Prevent broswer from sending a HTTP GET request with parameters
	// in form (and perhaps refreshing the page)
	event.preventDefault();

	// Connect to AWS Cognito to authenticate user
	var authenticationData = {
            Username: this.state.username,
            Password: this.state.password,
	};
	// var authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
	var authenticationDetails = new AuthenticationDetails(authenticationData);
	var poolData = {
            UserPoolId : COGNITO_USER_POOL_ID,
            ClientId : COGNITO_CLIENT_ID
	};
	var userPool = new CognitoUserPool(poolData);
	var userData = {
            Username : this.state.username,
            Pool : userPool
	};
	var cognitoUser = new CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
		console.log('access token + ' + result.getAccessToken().getJwtToken());

		let awsLoginKey =
		    'cognito-idp.' + COGNITO_REGION + '.amazonaws.com/'
		    + COGNITO_USER_POOL_ID;
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
                    Logins : {
			// Change the key below according to the specific region your user pool is in.
			awsLoginKey : result.getIdToken().getJwtToken()
                    }
		});

		// Instantiate aws sdk service objects now that the credentials have been updated.
		// example: var s3 = new AWS.S3();

            },

            onFailure: function(err) {
		alert(err);
            },
	});
    }
    
    render() {
	return (
	    <form onSubmit={this.handleSubmit}>
	      Username:
	      <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
	      Password:
	      <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
	      <input type="submit" value="Log In"/>
	    </form>
	);
    }
}
