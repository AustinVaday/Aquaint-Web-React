import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

import * as AwsConfig from './components/AwsConfig';
import { aquaintApp } from './states/reducers';
import { UserSignupForm } from './components/UserSignupForm.jsx';
import { DisplayProfile } from './components/DisplayProfile.jsx';
import IndexPage from './components/IndexPage.jsx';
import { UserProfilePageWrapper } from './components/UserProfilePageWrapper.jsx';
import { UserNotFound } from './components/error/UserNotFound.jsx';
import { loginUser } from './states/actions';

// Redux store, which should be one and only one instance in the app
let store = createStore(aquaintApp);

// Initialize the Amazon Cognito credentials provider
// TODO: change this variable name to AWS_REGION
AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

// A class can be a component passed to react-router too, besides a function
// "match" parameters are passed in as props in this case
const reactRender = () => {
    console.log('reactRender() called');
    ReactDOM.render((
            <Router>
            <Provider store={store}>
            <div>
            <Route exact path="/" component={IndexPage}/>
            <Route path="/error/nonexist" component={UserNotFound}/>
            <Route path="/user/:username" component={UserProfilePageWrapper}/>
            </div>
            </Provider>
            </Router>
    ), document.getElementById('root'));
};

// if the user is logged in previous sessions, read JWT from localStorage and keep logged in state
// #1: Cognito User Pool
var poolData = {
    UserPoolId: AwsConfig.COGNITO_USER_POOL_ID,
    ClientId: AwsConfig.COGNITO_CLIENT_ID
};
var userPool = new CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {
    console.log("cognitoUser present in localStorage.");
    cognitoUser.getSession(function(err, session) {
        if (err) {
            alert(err);
            return;
        }
        console.log('session validity: ' + session.isValid());

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function(err, attributes) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                // Do something with attributes
                console.log("cognitoUser userAttributes: ", attributes);
            }
        });

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID,
            Logins: {
                'cognito-idp.us-east-1.amazonaws.com/us-east-1_yyImSiaeD': session.getIdToken().getJwtToken()
            }
        });

        // store user authentication state to Redux
        store.dispatch(loginUser(cognitoUser.getUsername()));

        reactRender();
        return;
    });

} else {
    // #2: Facebook Login
    // NOTE: check Facebook login status only if user is not logged in through Cognito User Pool
    FB.getLoginStatus(function(response) {
        console.log("Login status in FB SDK: ", response);

        if (response.status == "connected") {
            console.log("User is logged into Facebook and Aquaint app; restore login status: ", response);

            // Add the Facebook access token to the Cognito credentials login map.
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID,
                Logins: {
                    'graph.facebook.com': response.authResponse.accessToken
                }
            });

            // retrieve the associated Aquaint username of this FB user
            AWS.config.credentials.get(function() {
                const identityId = AWS.config.credentials.identityId;

                var ddb = new AWS.DynamoDB();
                var identityTableParams = {
                    TableName: 'aquaint-user-identity',
                    Key: {
                        'identityId': {S: identityId}
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
                            store.dispatch(loginUser(username));

                            reactRender();
                            return;

                        } else {
                            console.err("User has logged into the app by Facebook before, but no cognitoIdentity-username mapping is found.");
                        }
                    }
                });
            });

        } else {
            // User is not logged into either Cognito User Pool or Facebook
            reactRender();
            return;
        }
    });
}
