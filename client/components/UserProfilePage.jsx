import React from 'react';
import ReactDOM from 'react-dom';

import GetNavBar from './GetNavBar.jsx'; 
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
	console.log("It has access to AWS SDK global instance: ", AWS);

	this.state = {
            currentPage: 1, // 1 for displaying, 2 for adding
            newUserProfile: "",

	    userRealname: '',
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
	this.getUserSmpList = this.getUserSmpList.bind(this);

	this.getUserSmpList('austin');
    }

    getUserSmpDict(user) {
	var ddb = new AWS.DynamoDB();
	var ddbTableParams = {
	    TableName: 'aquaint-users',
	    Key: {
		'username': {S: user}
	    }
	};
	ddb.getItem(ddbTableParams, function(err, data) {
	    if (err) {
		console.log("Error accessing DynamoDB table: ", err);
	    } else {
		console.log("User entry in aquaint-user table:", data);
		var socialDict = {};
		
		if (data.Item != null) {
		    for (var socialMapElem in data.Item.accounts.M) {
			var singleSocialArray = [];
			for (var socialId in data.Item.accounts.M[socialMapElem].L) {
			    singleSocialArray.push(data.Item.accounts.M[socialMapElem].L[socialId].S);
			}
			socialDict[socialMapElem] = singleSocialArray;
		    }
		}

		this.setState({ userSmpDict: socialDict });
	    }
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
	
	if (this.state.currentPage==1) {
            console.log("in state 1");
            return (
		<div>
		  {activatedSMP}
		  <button type="submit" className="profile-edit-button" onClick={this.editProfile}>Edit Profiles</button>
		</div>);
	}
	
	else if (this.state.currentPage==2) {
            console.log("in state 2");
            return (
		<div>
		  <GetNavBar />
		  {allSMP}
		  <button type="submit" className="profile-edit-button" onClick={this.finishEdit}>Finish</button>
		</div>);
	} else if (this.state.currentPage==3) {
            console.log("in state 3");
            return (
		<div className="profile-section">
		  <GetNavBar />
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
    
    /*
    render() {
    
	return (
	    <div>
	      <GetNavBar />

	      <header id="full-intro" className="intro-block">
		<div className="container">
		  <div className="row">
		    <div className="col-md-4 col-sm-12">

		      <p>
			Welcome to your profile page, <br/>{this.props.match.params.username}!
		      </p>
		      
		    </div>
		  </div>
		</div>
	      </header>
	    </div>
	);
    }
    */
}
