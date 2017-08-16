import React from 'react';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import * as AwsConfig from './AwsConfig';
import { UserLoginForm } from './UserLoginForm.jsx';
import { Route, Redirect } from 'react-router';

// Initialize the Amazon Cognito credentials provider
var AWS = require('aws-sdk');
// TODO: change this variable name to AWS_REGION
AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

// React Component for User Signup, including registering a new user on AWS services
export class UserSignupForm extends React.Component {

    // Note: instead of using a variable (or an Enum) to store currentPage,
    // it should be stored in the Component state, for possible re-rendering

    constructor(props) {
        super(props);

	console.log("UserSignupForm constructor() called.");

	//this.FB = props.fb;  // Facebook SDK instance
	//this.identityId = 'Testing Identity ID';
        this.state = {
            currentPage: 0, // 0 for first part of sign-up, 1 for second part, 2 for user login

            email: '',
            fullname: '',
            username: '',
            password: '',
            passwordVerify: '',

	    willRedirect: false,
	    redirectURI: '',
	    FbSignupUsername: '',
	    identityId: ''  // Identifier from Cognito Federated Identity that uniquely distinguish a user
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
	this.facebookLogin = this.facebookLogin.bind(this);
	//this.completeUserRegistration = this.completeUserRegistration.bind(this);
	this.completeFacebookSignup = this.completeFacebookSignup.bind(this);
    };

    /*
    completeUserRegistration(username) {
    	// generate user scan code on Lambda
    	var lambda = new AWS.Lambda({region: AwsConfig.AWS_REGION});
    	var lambdaPayload = {
    	    'action': 'createScanCodeForUser',
    	    'target': username
    	};
    	var pullParams = {
    	    FunctionName: 'createScanCodeForUser',
    	    InvocationType: 'Event',
    	    LogType: 'None',
    	    Payload: JSON.stringify(lambdaPayload)
    	};
    	var pullResults;
    	lambda.invoke(pullParams, function(err, data) {
    	    if (err) {
    		console.log(err);
    	    } else {
    		pullResults = JSON.parse(data.Payload);
    		console.log("Invoking Lambda function successful: ", pullResults);
    	    }
    	});

    	// create empty user entry on DynamoDB
    	FB.api('/me', function(response) {
    	    console.log(response);
    	});
    	let userTableParams = {
    	    TableName: 'aquaint-users',
    	    Item: {
    		'username': username,
    	    }
    	};
    };
    */

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
	    
	    this.state.identityId = AWS.config.credentials.identityId;
	    console.log(`Cognito User Pool signup: your Amazon Cognito Identity: ${this.state.identityId}`);

	    // Pass the user information to parent-level index page, for navigation bar
	    let userState = {
		isAuthorized: true,
		username: cognitoUser.getUsername()
	    };
	    this.props.indexPageUpdateState(userState);
	    
	    // TODO: Use case 17 integrating User Pools with Cognito Identity

        }.bind(this));

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
		    this.state.identityId = AWS.config.credentials.identityId;
		    console.log(`Facebook Login: your Amazon Cognito Identity: ${this.state.identityId}`);

		    var ddb = new AWS.DynamoDB();

		    // first check if there is an Aquaint username associated
		    // with this Identity ID
		    var identityTableParams = {
			TableName: 'aquaint-user-identity',
			Key: {
			    'identityId': {S: this.state.identityId}
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

				// Pass the user information to parent-level index page, for navigation bar
				let userState = {
				    isAuthorized: true,
				    username: username
				};
				this.props.indexPageUpdateState(userState);

				// User is now logged in; redirect user to his Aquaint profile
				this.setState({
				    willRedirect: true,
				    redirectURI: '/' + username
				});
			    } else {
				this.setState({currentPage: 3});
			    }
			}
		    }.bind(this));
		}.bind(this));

	    } else {
		alert("There is a problem logging you in from Facebook.");
	    }
	}.bind(this));

	// Note: these (annoyting) binds are necessary for anonymous functions
	// to access React-buildin functions, Eg. setState()
	// https://stackoverflow.com/questions/31045716/react-this-setstate-is-not-a-function
    }


    completeFacebookSignup(event) {
	event.preventDefault();
	// create an Aquaint username, if this is the first time user
	// Logs in by Facebook
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
			console.log(`completeFacebookSignup() reads identityID: ${this.state.identityId}`);
			// Username is available, link the identity ID to the user name
			let identityTableItem = {
			    TableName: 'aquaint-user-identity',
			    Item: {
				'identityId': {S: this.state.identityId},
				'username': {S: signup_username}
			    }
			};
			ddb.putItem(identityTableItem, function(err, data) {
			    if (err == null) {
				console.log('Login by Facebook user registration successful.');
				// completeUserRegistration(signup_username);

				// TODO: put below code in a separate function
    				// generate user scan code on Lambda
    				var lambda = new AWS.Lambda();
    				var lambdaPayload = {
    				    'action': 'createScanCodeForUser',
    				    'target': signup_username
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

    				// create empty user entry on DynamoDB
    				FB.api('/me', function(response) {
				    let userTableNewEntryParams = {
    					TableName: 'aquaint-users',
    					Item: {
    					    'username': {S: signup_username},
					    'realname': {S: response['name']}
    					}
    				    };
				    ddb.putItem(userTableNewEntryParams, function(err, data) {
					if (err) {
					    console.log(err);
					} else {
					    console.log("Initializing user's social media profiles list in DynamoDB successful.");


					    // Pass the user information to parent-level index page, for navigation bar
					    let userState = {
						isAuthorized: true,
						username: signup_username
					    };
					    this.props.indexPageUpdateState(userState);

					    // User is now logged in; redirect user to his Aquaint profile
					    this.setState({
						willRedirect: true,
						redirectURI: '/' + signup_username
					    });
					}
				    }.bind(this));
    				}.bind(this));

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
	
	if (this.state.willRedirect) {
	    return (
		<Redirect to={this.state.redirectURI} params={{indexPageState: this.state}}/>
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
                     <input className="welcome-input" placeholder="Verify Password" type="password" name="password" value={this.state.passwordVerify} onChange={this.handleChange} />
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
