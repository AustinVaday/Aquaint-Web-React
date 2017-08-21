import React from 'react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

import * as AwsConfig from './AwsConfig';
import { loginUser } from '../states/actions'; 
import UserLoginForm from './UserLoginForm.jsx';


// Initialize the Amazon Cognito credentials provider
// TODO: change this variable name to AWS_REGION
AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

// React Component for User Signup, including registering a new user on AWS services
class UserSignupFormLocal extends React.Component {

    // Note: instead of using a variable (or an Enum) to store currentPage,
    // it should be stored in the Component state, for possible re-rendering

    constructor(props) {
        super(props);
	console.log("UserSignupForm constructor() called. Props: ", this.props);

	//this.FB = props.fb;  // Facebook SDK instance
	this.identityId = null;  // Identifier from Cognito Federated Identity that uniquely distinguish a user
	
        this.state = {
	    // UI state of which part of the form it should display
	    // TODO: make this an enum
            currentPage: 0, // 0 for first part of sign-up, 1 for second part, 2 for user login, 3 for choosing a username if login by Facebook the first time

            email: '',
            fullname: '',
            username: '',
            password: '',
            passwordVerify: '',

	    redirectUri: null,
	    
	    FbSignupUsername: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
	this.facebookLogin = this.facebookLogin.bind(this);
	this.completeUserRegistration = this.completeUserRegistration.bind(this);
	this.completeFacebookSignup = this.completeFacebookSignup.bind(this);
    };

    componentDidUpdate() {
	console.log("UserSignupForm componentDidUpdate; State: ", this.state);
    }
    
    // Initialize a new Aquaint user in AWS databases
    completeUserRegistration(username) {
    	// generate user scan code on Lambda
    	var lambda = new AWS.Lambda();
    	var lambdaPayload = {
    	    'action': 'createScanCodeForUser',
    	    'target': username
    	};
    	var pullParams = {
    	    FunctionName: 'mock_api',
    	    InvocationType: 'Event',
    	    LogType: 'None',
    	    Payload: JSON.stringify(lambdaPayload)
    	};
    	var pullResults;
    	lambda.invoke(pullParams, function(err, data) {
    	    if (err) {
    		console.log(err);
    	    } else {
    		//pullResults = JSON.parse(data.Payload);
    		console.log("Invoking Lambda function successful: ", data);
    	    }
    	});

    	// create empty user entry on DynamoDB, using real name on Facebook
    	FB.api('/me', function(response) {
	    let userTableNewEntryParams = {
    		TableName: 'aquaint-users',
    		Item: {
    		    'username': {S: username},
		    'realname': {S: response['name']}
    		}
    	    };

	    var ddb = new AWS.DynamoDB();
	    ddb.putItem(userTableNewEntryParams, function(err, data) {
		if (err) {
		    console.log(err);
		} else {
		    console.log("Initializing user's social media profiles list in DynamoDB successful.");

		    // Update Redux global state of user authentication
		    this.props.dispatch(loginUser(username));

		    // User is now logged in; redirect user to his Aquaint profile
		    this.setState({
			redirectUri: '/' + username
		    });
		}
	    }.bind(this));
    	}.bind(this));

    }
    
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

    // Sign up a new Aquaint user through AWS Cognito User Pool
    handleSignup(event) {
        event.preventDefault();

        console.log('User completes sign-up form. State: ' + this.state);

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
	    let signupUsername = cognitoUser.getUsername();
            alert(`AWS Cognito User Pool signup successful; Welcome, ${signupUsername}!`);

	    // Integrating User Pools with Cognito Identity to give permission
	    // on AWS resources
	    if (cognitoUser != null) {
		// we still have to authenticate (Login) the user after it is
		// signed up
		var authenticationData = {
		    Username: this.state.username,
		    Password: this.state.password
		};
		var authenticationDetails = new AuthenticationDetails(authenticationData);
		cognitoUser.authenticateUser(authenticationDetails, {
		    onSuccess: function(result) {
			cognitoUser.getSession(function(err, result) {
			    if (err) {
				console.log("cognitoUser getSession() error: ", err);
				return;
			    }
			    if (result) {
				AWS.config.credentials = new AWS.CognitoIdentityCredentials({
				    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID,
				    Logins: {
					'cognito-idp.us-east-1.amazonaws.com/us-east-1_yyImSiaeD': result.getIdToken().getJwtToken()
				    }
				});
				
				// call refresh method in order to authenticate user and get new temp credentials
				AWS.config.credentials.refresh(function(error) {
				    if (error) {
					console.error(error);
					return;
				    } else {
					console.log('User authorization succeeds; AWS credentials refreshed.');
					
					// Update Redux global state of user authentication
					this.props.dispatch(loginUser(signupUsername));

					this.identityId = AWS.config.credentials.identityId;
					console.log(`Cognito User Pool signup: your Amazon Cognito Identity: ${this.identityId}`);
				    }
				}.bind(this));

			    }
			}.bind(this));

		    }.bind(this),

		    onFailure: function(err) {
			console.log('User authentication failed after Cognito User Pool signup: ', err);
		    }
		});
	    }
        }.bind(this));

    };

    // redirect to UserLoginForm page for existing Cognito User Pool user login
    handleLogin(event) {
        event.preventDefault();

        this.setState({currentPage: 2});
    }

    // Entry point of Login by Facebook
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
		    this.identityId = AWS.config.credentials.identityId;
		    console.log(`Facebook Login: your Amazon Cognito Identity: ${this.identityId}`);

		    var ddb = new AWS.DynamoDB();

		    // first check if there is an Aquaint username associated
		    // with this Identity ID
		    var identityTableParams = {
			TableName: 'aquaint-user-identity',
			Key: {
			    'identityId': {S: this.identityId}
			}
		    };
		    ddb.getItem(identityTableParams, function(err, data) {
			if (err) {
			    console.log("Error accessing DynamoDB table: ", err);
			} else {
			    console.log("Accessing aquaint-user-identity DynamoDB table success: ", data.Item);

			    if (data.Item != null) {
				let username = data.Item['username']['S'];
				console.log(`Cognito Identity has an Aquaint username assoicated: ${username}`);

				// Update Redux global state of user authentication
				this.props.dispatch(loginUser(username));
				
				// User is now logged in; redirect user to his Aquaint profile
				this.setState({
				    redirectUri: '/' + username
				});
			    } else {
				// the Facebook user hasn't used Aquaint before
				// go to the page to let him choose an Aquaint username
				this.setState({currentPage: 3});
			    }
			}
		    }.bind(this));
		}.bind(this));

	    } else {
		alert("There is a problem logging you in from Facebook.");
	    }
	}.bind(this));

	// Note: these binds are necessary for anonymous functions
	// to access React-buildin functions, Eg. setState()
    }

    // this function is called when a Facebook user uses Aquaint for the first time,
    // and just finishes entering an Aquaint username
    completeFacebookSignup(event) {
	event.preventDefault();
	
	console.log("completeFacebookSignup function called.");

	var signup_username = this.state.FbSignupUsername;
	if (signup_username != null || signup_username != '') {
	    var ddb = new AWS.DynamoDB();

	    // check if the username has been occupied or not
	    // including users from Cognito User Pool or Facebook authentication
	    let userTableParams = {
		TableName: 'aquaint-users',
		Key: {
		    'username': {S: signup_username}
		}
	    };
	    ddb.getItem(userTableParams, function(err, data) {
		if (err == null) {
		    if (data.Item != null) {
			alert("This Aquaint username is not available; please try a different one.");
			this.setState({ FbSignupUsername: '' });
		    } else {
			console.log(`completeFacebookSignup() reads identityID: ${this.identityId}`);
			// Username is available, link the identity ID to the user name
			let identityTableItem = {
			    TableName: 'aquaint-user-identity',
			    Item: {
				'identityId': {S: this.identityId},
				'username': {S: signup_username}
			    }
			};
			ddb.putItem(identityTableItem, function(err, data) {
			    if (err == null) {
				console.log('Login by Facebook user signup successful; initializing the new user now.');

				this.completeUserRegistration(signup_username);

				// TODO: the URI redirection not working now
				this.setState({
				    redirectUri: '/' + signup_username
				});
			    } else {
				console.log("Error accessing DynamoDB table:", err);
			    }
			}.bind(this));
		    }
		} else {
		    console.log("Error accessing DynamoDB table: ", err);
		}
	    }.bind(this));
	}
    };

    render() {
	
	if (this.state.redirectUri) {
	    return (
		<Redirect to={{pathname: this.state.redirectUri}} />
	    );
	}
	

        if (this.state.currentPage == 0) {
            return (
                <div className="welcome-div">
                    <img height="15%" src="./images/Aquaint_welcome_logo.svg"/>
                    <h1 className="welcome-header">Let's get Aquainted.</h1>
                    <h2 className="welcome-subtitle">All your social media profiles in one place.</h2>
                    <p className ="welcome-instruction"> Sign up with...</p>
                    <button className="welcome-button" onClick={this.facebookLogin}>
                      <img  id="image-padding" height="50%" src="./images/facebook_login_icon.svg" /><a id="fb-padding">Facebook</a>
                    </button>
                    <br/><br/><br/>
                    <p className ="welcome-instruction">
                        Or, sign up with email
                    </p>
                    <form onSubmit={this.handleContinue}>
                        <input className="welcome-input" type="text" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
                        <br/>
                        <input className="welcome-input" type="text" name="fullname" placeholder="Name" value={this.state.fullname} onChange={this.handleChange}/>
                        <br/>
                        <button className="welcome-button" id="continue">
                            <a className="welcome-continue">Continue</a>
                        </button>
                        <p className="welcome-instruction">
                            Already registered? <a className="welcome-signin" href="#" onClick={this.handleLogin}> Sign in here.</a>
                        </p>
                    </form>
                </div>
            );

        } else if (this.state.currentPage == 1) {
            return (
              <div className ="welcome-div">
                <img height="15%" src="./images/Aquaint_welcome_logo.svg" />
                <h1 className="welcome-header">Welcome</h1>
                <h2 className="welcome-subtitle">You're one step away from a brand new experience</h2>
                <br/><br/>
                  <form onSubmit={this.handleSignup}>
                     <input className="welcome-input" placeholder="Username"  name="username" value={this.state.username} onChange={this.handleChange} />
                     <br />
                     <input className="welcome-input" placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                     <br />
                     <input className="welcome-input" placeholder="Verify Password" type="password" name="passwordVerify" value={this.state.passwordVerify} onChange={this.handleChange} />
                    <br />
                    <button className ="welcome-button" id="continue"><a className="welcome-continue">Join Aquaint</a></button>
                  </form>
                </div>
            );

        } else if (this.state.currentPage == 2) {
            return (<UserLoginForm indexPageUpdateState={this.props.indexPageUpdateState}/>);

        } else if (this.state.currentPage == 3) {
            return (
                <div className="welcome-div">
                <img height="15%" src="./images/Aquaint_welcome_logo.svg" />
                <h1 className="welcome-header">Welcome</h1>
                <h2 className="welcome-subtitle">You're one step away from a brand new experience</h2>
                <br/><br/>
                    <form onSubmit={this.completeFacebookSignup}>
                        <input className="welcome-input" placeholder="Choose an username for your Aquaint profile..." name="FbSignupUsername" value={this.state.FbSignupUsername} onChange={this.handleChange}/>
                        <br/>
                        <button className="welcome-button" type="submit" value="Join Aquaint">
                            <a>Join Aquaint</a>
                        </button>
                    </form>
                </div>
            );
        }
        return null;
    }
}

// connect component to Redux 
let UserSignupForm = connect()(UserSignupFormLocal);
export default UserSignupForm;
