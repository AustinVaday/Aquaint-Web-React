import React from 'react';
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import * as AwsConfig from './AwsConfig';

// React Component for User Login, including user authentication on AWS Cognito
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
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        console.log('User tried to log in: ' + this.state.username + '; ' + this.state.password);
        // Prevent broswer from sending a HTTP GET request with parameters
        // in form (and perhaps refreshing the page)
        event.preventDefault();

        // Connect to AWS Cognito to authenticate user
        var authenticationData = {
            Username: this.state.username,
            Password: this.state.password
        };
        // var authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        var authenticationDetails = new AuthenticationDetails(authenticationData);
        var poolData = {
            UserPoolId: AwsConfig.COGNITO_USER_POOL_ID,
            ClientId: AwsConfig.COGNITO_CLIENT_ID
        };
        var userPool = new CognitoUserPool(poolData);
        var userData = {
            Username: this.state.username,
            Pool: userPool
        };
        var cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());

                let awsLoginKey = 'cognito-idp.' + AwsConfig.COGNITO_REGION + '.amazonaws.com/' + AwsConfig.COGNITO_USER_POOL_ID;
		console.log(`awsLoginKey = ${awsLoginKey}`);
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID,
                    Logins: {
                        // "you can not replace the login key with a variable because it will be interpreted literally"
			// See Use case 17 on amazon-cognito-identity-js
                        'cognito-idp.us-east-1.amazonaws.com/us-east-1_yyImSiaeD': result.getIdToken().getJwtToken()
                    }
                });

                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();
                alert("AWS Cognito user login successful!")

		AWS.config.credentials.refresh((error) => {
		    if (error) {
			console.error(error);
		    } else {
			var identityId = AWS.config.credentials.identityId;
			console.log(`Cognito User Pool login: your Amazon Cognito Identity: ${identityId}`);
		    }

		});
	    },

	    // 	var cognitoIdentity = new AWS.CognitoIdentity()
	    // 	cognitoIdentity.getId({
            //         IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID,
            //         Logins: {
            //             awsLoginKey: result.getIdToken().getJwtToken()
            //         }}), function (err, identityData) {
	    // 		if (err) {
	    // 		    console.log(err);
	    // 		}

	    // 		alert(`Your Amazon Cognito Identity by getID(): ${identityData}`);
	    // 	    };
            // },

            onFailure: function(err) {
                alert(err);
            }
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
