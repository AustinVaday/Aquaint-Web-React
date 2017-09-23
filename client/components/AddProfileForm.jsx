import React from 'react';
import ReactDOM from 'react-dom';

import * as AwsConfig from './AwsConfig';

AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});


class AddProfileForm extends React.Component {

    // TODO: migrate the extra part in UserProfilePage state 3 to this sub-component
    // Problems that have to be solved:
    // (1) a graceful way to pass data (socialNamePendingToAdd) from a function in UserProfilePage (formPopUp) to this component
    // (2) access member variables and functions in UserProfilePage (perhaps the entire class?) from here: adduserSmp() should be used here
    // (3) "destruct" itself when user submits the form

    constructor(props) {
        super(props);
    }

    handleSubmit(event) {

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return null;
    }
}
