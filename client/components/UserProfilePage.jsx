import React from 'react';
import ReactDOM from 'react-dom';

import * as AwsConfig from './AwsConfig';

AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

export class UserProfilePage extends React.Component {
    // TODO: 1) connect to database for props
    //       2) approperiate method for adding username (using state?)

    constructor(props) {
	super(props);
	console.log("UserProfilePage constructor called. Props: ", this.props);
	//console.log("It has access to AWS SDK global instance: ", AWS);

	this.user = this.props.match.params.username;
	this.state = {
            currentPage: 1, // 1 for displaying, 2 for adding
            newUserProfile: "",

	    userRealname: null,
	    userSmpDict: {}
        };

	// test data
	/*
	this.state.userSmpDict = {} //should be from User's JSON data
	this.state.userSmpDict["google"]="austin";
	this.state.userSmpDict["twitter"]="austin";
	this.state.userSmpDict["facebook"]="austin";
	this.state.userSmpDict["slack"]="austin";
	this.state.userSmpDict["tumblr"]="austin";
        this.state.userSmpDict["soundcloud"]="austin";
        this.state.userSmpDict["ios"]="austin";
        this.state.userSmpDict["android"]="austin";
        this.state.userSmpDict["youtube"]="austin";
	*/
	
	// constant order
	this.profileList = ['facebook','snapchat','youtube','tumblr', 'soundcloud', 'website', 'ios', 'android', 'google','twitter','instagram','slack','linkedin'];
	this.orderedProfiles = this.profileList.sort();

	// member function bindings
	this.getUserSmpDict = this.getUserSmpDict.bind(this);
	this.addUserSmp = this.addUserSmp.bind(this);
	this.editProfile = this.editProfile.bind(this);
	this.finishEdit = this.finishEdit.bind(this);
	this.formPopUp = this.formPopUp.bind(this);
	this.finishAdd = this.finishAdd.bind(this);
	
	this.getUserSmpDict();
    }

    componentDidUpdate() {
	console.log("UserProfilePage componentDidUpdate. State: ", this.state);
    }

    // get Aquaint user data (real name, social media profiles, etc.) from DynamoDB
    // only needs to be called once in React component's constructor
    getUserSmpDict() {
	var ddb = new AWS.DynamoDB();
	var ddbTableParams = {
	    TableName: 'aquaint-users',
	    Key: {
		'username': {S: this.user}
	    }
	};
	ddb.getItem(ddbTableParams, function(err, data) {
	    if (err) {
		console.log("Error accessing DynamoDB table: ", err);
	    } else {
		console.log("User entry in aquaint-user table:", data);
		if (this.state.userRealname == null) {
		    this.setState({ userRealname: data.Item.realname.S });
		}
		
		var socialDict = {};
		if (data.Item.accounts != null) {
		    for (var socialMapElem in data.Item.accounts.M) {
			var singleSocialArray = [];
			for (var socialId in data.Item.accounts.M[socialMapElem].L) {
			    console.log(socialMapElem + ": " + data.Item.accounts.M[socialMapElem].L[socialId].S);
			    singleSocialArray.push(data.Item.accounts.M[socialMapElem].L[socialId].S);
			}
			socialDict[socialMapElem] = singleSocialArray;
		    }
		}

		this.setState({ userSmpDict: socialDict });
	    }
	}.bind(this));
    }

    // add a social media profile to this Aquaint user
    // reflecting the change on UI and sending this change to AWS backend
    addUserSmp(smpName, smpValue) {
	// first update the local state, so the changes will reflect on UI immediately
	var socialDictUpdate = this.state.userSmpDict;
	if (socialDictUpdate[smpName]) {
	    socialDictUpdate[smpName].push(smpValue);
	} else {
	    socialDictUpdate[smpName] = [smpValue];
	}
	this.setState({ userSmpDict: socialDictUpdate });

	// then upload this new user dictionary onto DynamoDB, asynchronously
	var ddb = new AWS.DynamoDB();
	var ddbTableParams = {
	    TableName: 'aquaint-users',
	    Key: {
		'username': {S: this.user}
	    }
	};
	ddb.getItem(ddbTableParams, function(err, data) {
	    if (err) {
		console.log("Error accessing DynamoDB table: ", err);
		return;
	    }

	    // first, retrieve up-to-date data from DynamoDB and apply the changes
	    // the retrieved data is the newest so there will be no race condition
	    // if user is modifying profile on multiple devices simultaneously
	    var socialDictUpload = data.Item;
	    if (socialDictUpload.accounts != null && socialDictUpload.accounts.M[smpName]) {
		socialDictUpload.accounts.M[smpName].L.push({
		    S: smpValue
		});
	    } else {
		if (socialDictUpload.accounts == null) {
		    socialDictUpload['accounts'] = {
			    M: {}
		    };
		}
		let singleSocialList = {
		    L: [
			{
			    S: smpValue
			}
		    ]
		};
		socialDictUpload.accounts.M[smpName] = singleSocialList;
	    } 

	    // upload the updated data to DynamoDB
	    var putParams = {
		TableName: "aquaint-users",
		Item: socialDictUpload
	    };

	    ddb.putItem(putParams, function(error, data) {
		if (error) {
		    console.log(error, error.stack);
		} else {
		    console.log("DATA STORED TO DYNAMO! CHECK DYNAMO TO VERIFY.");
		    console.log(data);
		}
	    });
	    
	}.bind(this));
    }
    
    editProfile(event) {
        event.preventDefault();
        this.setState({
            currentPage: 2,
        });
    }

    finishEdit(event) {
        event.preventDefault();
        this.setState({
            currentPage: 1,
        });
    }

    formPopUp(event) {
        event.preventDefault();
        this.setState({
            currentPage: 3,
        });
    }

    finishAdd(event) {
        event.preventDefault();

	// TESTING ONLY
	console.log("Finished editing form.");
	this.addUserSmp('facebook', '12345678');
	//this.addUserSmp('snapchat', 'wybmax');
	
        this.setState({
            currentPage: 2,
        });
    }

    handleChange(event) {
        // Update React state when the form's input changes
        // For example, when user types 'a' into the password field
        // event.target.name = password, and event.target.value = a
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
	console.log(this.state.userSmpDict);
	
	var activatedSMP = [];
	var existingSMP = Object.keys(this.state.userSmpDict).sort();
	for (var i = 0; i < existingSMP.length; i++) {
	    // TODO: we now suppose each social media site only contains 1 profile
            var sm = existingSMP[i];
            var dir = "./images/SMP/"+sm+"_color.svg";
    	    activatedSMP.push(
		<button key={i} type="submit" onClick={this.formPopUp} className="profile-button">
		  <img type="submit" className="profile-button-img" src={dir}/>
		</button>);
	}
	
	var allSMP = activatedSMP.slice();
	for (var i = 0; i < this.orderedProfiles.length; i++){
	    if(!existingSMP.includes(this.orderedProfiles[i])){
		var sm = this.orderedProfiles[i];
		var dir = "./images/SMP/"+sm+"_bw.svg";
		allSMP.push(
		    <button key={i} type="submit" onClick={this.formPopUp} className="profile-button">
		      <img type="submit" className="profile-button-img" src={dir}/>
		    </button>);
	    }
	}

	if (this.state.currentPage == 1) {
            console.log("in state 1");
            return (
		<div>
		  <h2 className="profile-name">{this.state.userRealname}</h2>
		  <p className="profile-bio">{this.user}'s dummy bio...</p>
		  {activatedSMP}
		  <button type="submit" className="profile-edit-button" onClick={this.editProfile}>Add Profiles</button>
		</div>);
	} else if (this.state.currentPage == 2) {
            console.log("in state 2");
            return (
		<div>
		  <h2 className="profile-name">{this.user}</h2>
		  <p className="profile-bio">{this.user}'s dummy bio... </p>
		  {allSMP}
		  <button type="submit" className="profile-edit-button" onClick={this.finishEdit}>Finish</button>
		</div>);
	} else if (this.state.currentPage == 3) {
            console.log("in state 3");
            return (
		<div>
		  <h2 className="profile-name">{this.user}</h2>
		  <p className="profile-bio">{this.user}'s dummy bio...</p>
		  {allSMP}
		  <div className="profile-add-box">
		    <form onSubmit={this.handleSubmit}>
		      <input className="profile-new-username" placeholder="Your Username/URL"  name="newUserProfile" value={this.state.newUserProfile} onChange={this.handleChange} />
		      <br/>
		      <button type="submit" className="profile-edit-button" id="add" onClick={this.finishAdd}>Add</button>
		    </form>
		  </div>
		</div>);
	}

        return null;
    }
}
