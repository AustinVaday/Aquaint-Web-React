import { combineReducers } from 'redux';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

import { LOGIN_USER, LOGOFF_USER } from './actions';
import * as AwsConfig from '../components/AwsConfig';

// state.userAuth is an username, a string which can be null (if no user is logged in)
function userAuth(state = null, action) {
    switch (action.type) {
    case LOGIN_USER:
	/*
	let tmp = Object.assign({}, { action.username });
	console.log("Redux LOGIN_USER action.username = ", action.username, "; new state: ", tmp);
	*/
	console.log("Redux LOGIN_USER: action.username = ", action.username);
	return action.username;
	
    case LOGOFF_USER:
	// if the user logs in by Facebook, logs off from FB SDK
	// TODO: this is asynchronous API call and redux reducer should be written in a different way
	// See: http://redux.js.org/docs/advanced/AsyncActions.html
	/*
	FB.getLoginStatus(function(response) {
	    if (response.status == 'connected') {
		FB.logout(function(response) {
		    console.log("Logs user off on Facebook SDK: ", response);
		});
	    }
	});
	*/

	// if the user logs in by Cognito User Pool, clear localStorage entry
	var poolData = {
	    UserPoolId: AwsConfig.COGNITO_USER_POOL_ID,
	    ClientId: AwsConfig.COGNITO_CLIENT_ID
	};
	var userPool = new CognitoUserPool(poolData);
	var cognitoUser = userPool.getCurrentUser();

	if (cognitoUser != null) {
	    cognitoUser.signOut();
	}

	// Revoke AWS access permissions
	AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

	return null;
	
    default:
	return state;
    }
}

export const aquaintApp = combineReducers({
    userAuth
});
