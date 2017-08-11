import React from 'react';
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import * as AwsConfig from './AwsConfig';
import {UserLoginForm} from './UserLoginForm.jsx';

// Initialize the Amazon Cognito credentials provider
var AWS = require('aws-sdk');
AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

// React Component for User Signup, including registering a new user on AWS services
export class UserSignupForm extends React.Component {

    // Note: instead of using a variable (or an Enum) to store currentPage,
    // it should be stored in the Component state, for possible re-rendering

    constructor(props) {
        super(props);

	this.FB = props.fb;  // Facebook SDK instance
        this.state = {
            currentPage: 0, // 0 for first part of sign-up, 1 for second part, 2 for user login
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
	this.facebookLogin = this.facebookLogin.bind(this);
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
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
        var poolData = {
            UserPoolId: AwsConfig.COGNITO_USER_POOL_ID,
            ClientId: AwsConfig.COGNITO_CLIENT_ID
        };
        var userPool = new CognitoUserPool(poolData);

        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: this.state.email
        };
        var attributeEmail = new CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        userPool.signUp(this.state.username, this.state.password, attributeList, null, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            var cognitoUser = result.user;
            alert(`AWS Cognito user signup successful; Welcome, ${cognitoUser.getUsername()}!`);
        });

    };

    handleLogin(event) {
        event.preventDefault();

        this.setState({currentPage: 2});
    }

    facebookLogin(event) {
	FB.login(function (response) {

	    // Check if the user logged in successfully.
	    if (response.authResponse) {

		alert('You are now logged in from Facebook.');

		// Add the Facebook access token to the Cognito credentials login map.
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID,
		    Logins: {
			'graph.facebook.com': response.authResponse.accessToken
		    }
		});

		// Obtain AWS credentials
		AWS.config.credentials.get(function(){
		    // Access AWS resources here.
		});

		var identityId = AWS.config.credentials.identityId;
		alert(`Your Amazon Cognito Identity: ${identityId}`)

	    } else {
		    alert('There was a problem logging you in from Facebook.');
	    }

	});
    }

    render() {
        if (this.state.currentPage == 0) {
            return (
                <div className="welcome-div">
                    <img height="15%" src="./images/emblemSpinner.gif"/>
                    <h1 className="welcome-header">Let's get Aquainted.</h1>
                    <p>
                        Sign up with...
                    </p>
                    <button className="welcome-button" onClick={this.facebookLogin}>
                        <a>Facebook</a>
                    </button>
                    <p>
                        Or, sign up with email
                    </p>
                    <form onSubmit={this.handleContinue}>
                        <input className="welcome-input" type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
                        <br/>
                        <input className="welcome-input" type="text" name="fullname" placeholder="Name" value={this.state.fullname} onChange={this.handleChange}/>
                        <br/>
                        <button className="welcome-button" id="continue">
                            <a className="welcome-hyperlink">Continue</a>
                        </button>
                        <p>
                            Already registered?
                            <a href="#" onClick={this.handleLogin}>
                                Sign in here.
                            </a>
                        </p>
                    </form>
                </div>
            );

        } else if (this.state.currentPage == 1) {
            return (
                <div className="welcome-div">
                    <form onSubmit={this.handleSignup}>
                        <h1 className="welcome-header">Welcome</h1>
                        <input className="welcome-input" placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange}/>
                        <br/>
                        <input className="welcome-input" placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                        <br/>
                        <input className="welcome-input" placeholder="Verify Password" type="password" name="passwordVerify" value={this.state.passwordVerify} onChange={this.handleChange}/>
                        <br/>
                        <button className="welcome-button">
                            <a>Join Aquaint</a>
                        </button>
                    </form>
                </div>
            );

        } else if (this.state.currentPage == 2) {
            return (<UserLoginForm/>);
        }
        return null;
    }
}
