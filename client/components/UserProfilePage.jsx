import React from 'react';
import ReactDOM from 'react-dom';

//import AddProfileForm from './AddProfileForm.jsx';
import * as AwsConfig from './AwsConfig';

AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

export default class UserProfilePage extends React.Component {
    // TODO: 1) connect to database for props

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
	// TODO: this variable may not be really necessary
	this.socialNamePendingToAdd = null;  // the social media name being added in AddProfileForm

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
	this.handleChange = this.handleChange.bind(this);
	
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
			    //console.log(socialMapElem + ": " + data.Item.accounts.M[socialMapElem].L[socialId].S);
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

    formPopUp(socialMedia) {
        event.preventDefault();
	console.log("FormPopUp: ", socialMedia);

	this.socialNamePendingToAdd = socialMedia;
        this.setState({
            currentPage: 3,
        });
    }

    finishAdd(event) {
        event.preventDefault();

	console.log(`Finished editing form; going to add ${this.state.newUserProfile} to ${this.socialNamePendingToAdd}`);
	this.addUserSmp(this.socialNamePendingToAdd, this.state.newUserProfile);

	// TESTING ONLY
	//this.addUserSmp('facebook', '12345678');
	//this.addUserSmp('snapchat', 'wybmax');
	
	this.socialNamePendingToAdd = null;
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
            let sm = existingSMP[i];
            let dir = "./images/SMP/"+sm+"_color.svg";
    	    activatedSMP.push(
		<button key={sm} type="submit" onClick={() => this.formPopUp(sm)} className="profile-button">
		  <img type="submit" className="profile-button-img" src={dir}/>
		</button>);
	}
	
	var allSMP = activatedSMP.slice();
	for (var i = 0; i < this.orderedProfiles.length; i++){
	    if(!existingSMP.includes(this.orderedProfiles[i])){
		let sm = this.orderedProfiles[i];
		let dir = "./images/SMP/"+sm+"_bw.svg";
		allSMP.push(
		    <button key={sm} type="submit" onClick={() => this.formPopUp(sm)} className="profile-button">
		      <img type="submit" className="profile-button-img" src={dir}/>
		    </button>);
	    }
	}

	// allow user to edit his own profile page if a user is logged in
	console.log(`User permissions: this.userLoggedin = ${this.props.userLoggedin}, this.user = ${this.user}`);
	const allowEdit = (this.props.userLoggedin != null && this.props.userLoggedin == this.user) ? true : false;
	console.log("Can I edit this profile page now? ", allowEdit);
	
	if (this.state.currentPage == 1) {
            console.log("in state 1");
            return (
		<div>
		  <h2 className="profile-name">{this.state.userRealname}</h2>
		  <p className="profile-bio">{this.user}'s dummy bio...</p>
		  {activatedSMP}
		  { allowEdit &&
		      <button type="submit" className="profile-edit-button" onClick={this.editProfile}>Add Profiles</button>
		  }
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
		    <form>
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

