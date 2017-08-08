import React from 'react';
import styled from 'styled-components';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

/*                                   UI ELEMENTS                              */

// DIV
const Div = styled.div`
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-align: center;
  font-weight: 350;
  font-size: 0.8rem;
  color:#95989A;
  margin-top: 3em;
`

// GREETING
const H1 = styled.h1`
  font-weight: 300;
  font-size:2.5rem;
  color: #2F3541;
`

// INPUT FORM
const Input = styled.input`
  padding: 0.75rem;
  margin:0.5rem;
  max-width: 30em;
  height: 3em;
  width: 21em;
  border-style: solid;
  border-width: 0.25px;
  border-color: #95989A;
  background-color:transparent;
  border-radius: 5px;
`

// CONTINUE/LOGIN/SIGNUP BUTTONS
const Button = styled.input`
  letter-spacing: 0.5px;
  font-weight:300;
  color: white;
  padding: 0.3rem;
  margin:0.5rem;
  max-width: 30em;
  height: 3em;
  width: 15em;
  border-style: solid;
  border-width: 0.25px;
  border-color: #0E85AC;
  background-color:#0E85AC;
  border-radius: 50px;
`
// FACEBOOK LOGIN BUTTON
const FButton = styled.input`
  letter-spacing: 0.5px;
  font-weight:300;
  padding: 0.3rem;
  color: #95989A;
  margin:0.5rem;
  max-width: 30em;
  height: 3em;
  width: 15em;
  border-style: solid;
  border-width: 0.25px;
  border-color: #95989A;
  background-color:transparent;
  border-radius: 50px;
`
// FORM SECTION
const Form = styled.form`
  padding-top: 1.25em;
`

// TEXT INSTRUCTIONS
const Instruction = styled.p`
  padding-bottom: .75em;
  font-size: 1.25em;
  font-weight: 300;
`

const Subtitle = styled.p`
  margin-top: -1em;
  padding-bottom: .75em;
  font-size: 1.5em;
  font-weight: 300;
`

/*                            END OF UI ELEMENTS                              */

export class App extends React.Component {
  render() {
    return (
      <Div style={{marginTop: '10%'}}>
        <img src={'./app_demo_landing.png'} alt="clocks" ></img>
      </Div>);
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

export class UserLoginForm extends React.Component {
    // Make the form to be "Controlled Components"
    // that is, making the React state be the "single source of truth"
    // See: https://facebook.github.io/react/docs/forms.html
    constructor(props){
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
    // <Div className={'w-50'}>
    //   <H1>Welcome back!</H1>
    //   <form onSubmit={this.handleSubmit}>
    //    <Input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
    //    <br/>
    //    <Input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
    //   <br/><br/>
    //    <Button type="submit" value="Log In"/>
    //  </form>
    // </Div>

    // SignUP Form Mockup *REMEMBER TO CHANGE ELEMENT TYPES & NAMES & SIGNIN/LOGIN Methods

    <Div className={'w-50'}>
      <H1>Let's get Aquainted.</H1>
      <Subtitle>All of your social media profiles in one place.</Subtitle>
      <Form onSubmit={this.handleSubmit}>
        <Instruction> Sign up with... </Instruction>
        <FButton type="submit" value="Facebook" />
      </Form>
      <Form onSubmit={this.handleSubmit}>
        <Instruction> Or, sign up with email </Instruction>
       <Input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
       <br/>
       <Input type="text" name="realname" placeholder="Full Name" value={this.state.realname} onChange={this.handleChange}/>
      <br/>
       <Button type="submit" value="Continue"/>
     </Form>
     <Form onSubmit={this.handleSubmit}>
       <Instruction>Already registered? <a href="signin">Sign in here</a></Instruction>
     </Form>
    </Div>
	);
    }
}
