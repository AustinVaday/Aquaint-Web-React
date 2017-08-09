let COGNITO_REGION = 'us-east-1';
let COGNITO_IDENTITY_POOL_ID = 'us-east-1:ca5605a3-8ba9-4e60-a0ca-eae561e7c74e';
let COGNITO_USER_POOL_ID = 'us-east-1_yyImSiaeD';
let COGNITO_CLIENT_ID = '4dc7abqcmfsbi6v00765cohu8p'; // Aquaint-web client

// Initialize the Amazon Cognito credentials provider
AWS.config.region = COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
});

var UserLoginForm = React.createClass( {
    // Make the form to be "Controlled Components"
    // that is, making the React state be the "single source of truth"
    // See: https://facebook.github.io/react/docs/forms.html
    getInitialState: function() {

	return {
	    username: '',
	    password: ''
	};

	// Resolve error of "Cannot read property 'setState' of undefined"
	// only necessary in ES6 constructor syntax
	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
    },

    handleChange: function(event) {
	// Update React state when the form's input changes
	// For example, when user types 'a' into the password field
	// event.target.name = password, and event.target.value = a
	this.setState({
	    [event.target.name]: event.target.value
	});
    },

    handleSubmit: function(event) {
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
	    UserPoolId: COGNITO_USER_POOL_ID,
	    ClientId: COGNITO_CLIENT_ID
	};
	var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
	var userData = {
	    Username: this.state.username,
	    Pool: userPool
	};
	var cognitoUser = new CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
	    onSuccess: function(result) {
		console.log('access token + ' + result.getAccessToken().getJwtToken());

		let awsLoginKey =
		    'cognito-idp.' + COGNITO_REGION + '.amazonaws.com/' +
		    COGNITO_USER_POOL_ID;
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
		    Logins: {
			// Change the key below according to the specific region your user pool is in.
			awsLoginKey: result.getIdToken().getJwtToken()
		    }
		});

		// Instantiate aws sdk service objects now that the credentials have been updated.
		// example: var s3 = new AWS.S3();
		alert("AWS Cognito user login successful!")
	    },

	    onFailure: function(err) {
		alert(err);
	    },
	});
    },

    render: function() {
	return (
	    <form onSubmit={this.handleSubmit}>
	      Username:
	      <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
	      Password:
	      <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
	      <input type="submit" value="Log In"/>
	    </form>
	);
    },

});

var UserSignupForm = React.createClass({
    // Note: instead of using a variable (or an Enum) to store currentPage,
    // it should be stored in the Component state, for possible re-rendering

    getInitialState: function() {
        return {
            currentPage: 0, // 0 for first part of sign-up, 1 for second part, 2 for user login
            email: '',
            fullname: '',
            username: '',
            password: '',
            passwordVerify: ''
        };
    },

    handleChange: function(event) {
	console.log(`handleChange: ${event.target.name}, ${event.target.value}.`);
        this.setState({
            [event.target.name]: event.target.value
        });
    },

    handleContinue: function(event) {
        event.preventDefault();

        console.log("Changing to next signup page...");
        // Component state must be set by setState() function for necessary
        // parts to be re-rendered
        // this.state.currentPage = 1;
        this.setState({
            currentPage: 1
        });
    },

    handleSignup: function(event) {
        event.preventDefault();

        console.log('User completes sign-up form: ' + JSON.stringify(this.state));

        if (this.state.password != this.state.passwordVerify) {
            alert("Passwords don't match; please try again.");
        }

        // Sign up user in AWS Cognito Federated Identity
        var poolData = {
            UserPoolId: COGNITO_USER_POOL_ID,
            ClientId: COGNITO_CLIENT_ID
        };
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: this.state.email
        };
        var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        userPool.signUp(this.state.username, this.state.password, attributeList, null, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
        });
    },

    handleLogin: function(event) {
        event.preventDefault();

        this.setState({
            currentPage: 2
        });
    },
    render() {

        if (this.state.currentPage == 0) {
            return (
                <div className ="welcome-div">
                  <img height="15%" src="./images/emblemSpinner.gif" />
                  <h1 className="welcome-header">Let's get Aquainted.</h1>
                  <p> Sign up with... </p>
                  <button className="welcome-button">
                    <a>Facebook</a></button>
                  <p> Or, sign up with email </p>
                  <form onSubmit={this.handleContinue}>
                    <input className="welcome-input" type="text" name="email" placeholder="Email"  value={this.state.email} onChange={this.handleChange}/>
                    <br />
                    <input className="welcome-input" stype="text" name="fullname" placeholder="Name" value={this.state.fullname} onChange={this.handleChange}/>
                    <br />
                    <button className="welcome-button" id="continue">
                      <a className="welcome-hyperlink">Continue</a>
                    </button>
                    <p> Already registered? <a href="#" onClick={this.handleLogin}>
			Sign in here.
                    </a></p>
                  </form>
                </div>
              );
          } else if (this.state.currentPage == 1) {
              return (
                <div className ="welcome-div">
                  <form onSubmit={this.handleSignup}>
                    <h1 className="welcome-header">Welcome</h1>
                    <input className="welcome-input" placeholder="Username"  name="username" value={this.state.username} onChange={this.handleChange} />
                    <br />
                    <input className="welcome-input" placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    <br />
                    <input className="welcome-input" placeholder="Verify Password" type="password" name="passwordVerify" value={this.state.passwordVerify} onChange={this.handleChange} />
                    <br />
                    <button className ="welcome-button" ><a>Join Aquaint</a></button>
                  </form>
                </div>
              );
          } else if (this.state.currentPage == 2) {
              return ( <UserLoginForm /> );
          }
          return null;
    }
});

console.log('ReactDOM begins to render UserSignupForm.');
ReactDOM.render( < UserSignupForm /> , document.getElementById('userlogin'));
