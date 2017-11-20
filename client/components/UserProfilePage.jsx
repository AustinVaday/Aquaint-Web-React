import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router';

//import AddProfileForm from './AddProfileForm.jsx';
import * as AwsConfig from './AwsConfig';

/*
   AWS.config.region = AwsConfig.COGNITO_REGION; // Region
   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
   IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});
 */

export default class UserProfilePage extends React.Component {

    constructor(props) {
        super(props);
        console.log("UserProfilePage WOOOOOO constructor called. Props: ", this.props);
        //console.log("It has access to AWS SDK global instance: ", AWS);

        this.user = this.props.match.params.username;
        this.state = {
            // 1 for displaying linked profiles
            // 2 for displaying pending social media that can be added
            // 3 for adding a social media
            currentPage: 1,
            newUserProfile: "",
            userRealname: this.props.userData.userRealname,
            userSmpDict: this.props.userData.userSmpDict
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
        this.addUserSmp = this.addUserSmp.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.finishEdit = this.finishEdit.bind(this);
        this.formPopUp = this.formPopUp.bind(this);
        this.finishAdd = this.finishAdd.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleProfileClick = this.handleProfileClick.bind(this);
    }

    componentDidUpdate() {
        console.log("UserProfilePage componentDidUpdate. State: ", this.state);
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

        // for some social media sites that use particular ID for user profile URLs
        // the user is directed to its own authorization page and we do the linking
        if (socialMedia == "linkedin") {
            IN.User.authorize(function() {
                IN.API.Raw('/people/~?format=json').method('GET').result(function(response) {
                    console.log("LinkedIn API response: ", response);

                    var urlArray = response.siteStandardProfileRequest.url.split("id=");
                    console.log("User's LinkedIn URL being stored: ", urlArray[1]);
                    if (urlArray[1] != null) {
                        this.addUserSmp('linkedin', urlArray[1]);
                    }
                }.bind(this));
            }.bind(this));
            return;
        }

        if (socialMedia == "facebook") {
            FB.getLoginStatus(function(response) {
                // if the user is not yet logged in from Facebook SDK
                if (response.status != "connected") {
                    FB.login(function(res) {
                        if (res.authResponse) {
                            console.log("User logged in to FB SDK, userID: ", res.authResponse.userID);
                            this.addUserSmp('facebook', res.authResponse.userID);
                        }
                    }.bind(this));

                } else {
                    console.log("User logged in to FB SDK, userID: ", response.authResponse.userID);
                    this.addUserSmp('facebook', response.authResponse.userID);
                }
            }.bind(this));
            return;
        }

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
            newUserProfile: ''
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

    handleProfileClick(socialProvider, socialValue) {
        // Handle deep link to corresponding URL
        console.log("handle profile click, ", socialProvider, " ", socialValue);

        ga('create', 'UA-61394116-2', 'auto');
        ga('send', {
            hitType: 'pageview',
            page: location.pathname
        });

        // Create dictionary to fetch native url schemes
        var nativeUrlSchemes = {
            //"facebook": "",
            "snapchat": "snapchat://add/",
            "instagram": "instagram://user?username=",
            "twitter": "twitter:///user?screen_name=",
            "linkedin": "linkedin://profile/view?id=",
            "youtube": "youtube:www.youtube.com/user/",
            //"soundcloud": "",
            "tumblr": "tumblr://x-callback-url/blog?blogName="
        }
        function attemptOpenNative(nativeUrl, webUrl) {
            var desktopFallback = webUrl;
            var mobileFallback = webUrl;
            var app = nativeUrl;
            if( /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
                window.location = app;
                window.setTimeout(function() {
                    window.location = mobileFallback;
                }, 25);
            } else {
                window.open(desktopFallback);
            }
            function killPopup() {
                window.removeEventListener('pagehide', killPopup);
            }
            window.addEventListener('pagehide', killPopup);

        }

        function constructWebUrl(socialProvider, socialValue) {
            var path = 'https://'
            switch(socialProvider) {
                case "snapchat" : path += socialProvider + '.com/add/' + socialValue;
                    break;
                case "tumblr" : path += socialValue + '.' + socialProvider + '.com';
                    break;
                case "linkedin": path = "https://www.linkedin.com/profile/view?id=" + socialValue;
                    break;
                default: path += socialProvider + '.com/' + socialValue;

            }

            return path
        }

        ga('send', {
            hitType: 'event',
            eventCategory: 'SocialClicks',
            eventAction: 'click',
            eventLabel: socialProvider,
            transport: 'beacon'
        });

        if (socialProvider != "website" && socialProvider != "ios" && socialProvider != "android") {
            var webUrl = constructWebUrl(socialProvider, socialValue);
            if (socialProvider in nativeUrlSchemes) {
                var nativeUrl = nativeUrlSchemes[socialProvider] + socialValue;
                attemptOpenNative(nativeUrl, webUrl);
            } else {
                window.open(webUrl);
            }
            //window.open('https://' + socialProvider + '.com/' + socialValue);
        } else {
            window.open(socialValue);
        }



    }

    render() {
        console.log(this.state.userSmpDict);

        var activatedSMP = [];

        // Convert dictionary to a list of arrays i.e.:
        //   [ ['snapchat', 'austin1'],
        //     ['snapchat', 'austin2'],
        //     ['facebook', '123123123'] ]
        var sortedKeys = Object.keys(this.state.userSmpDict).sort();
        var existingSMP = [];

        console.log("sortedKeys: ", sortedKeys);
        for (var i in sortedKeys) {
            var key = sortedKeys[i]
            console.log("key: ", key);

            for (var j in this.state.userSmpDict[key]) {
                var username = this.state.userSmpDict[key][j];
                console.log("username: ", username);
                var tupleArray = [key, username];
                existingSMP.push(tupleArray);
            }
        }

        console.log("existingSMP new is: ", existingSMP);

        // var existingSMP = Object.keys(this.state.userSmpDict).sort();
        for (var i = 0; i < existingSMP.length; i++) {
            // TODO: we now suppose each social media site only contains 1 profile
            let sm = existingSMP[i][0];
            let username = existingSMP[i][1];
            let dir = "./images/SMP/"+sm+"_color.svg";
            let key = sm + '-' + i;
            activatedSMP.push(
                <button key={key} type="submit" onClick={() => this.handleProfileClick(sm, username)} className="profile-button">
                    <img type="submit" className="profile-button-img" src={dir}/>
                </button>);
        }
        var allSMP = activatedSMP.slice();
        for (var i = 0; i < this.orderedProfiles.length; i++){
            if(!existingSMP.includes(this.orderedProfiles[i])){
                let sm = this.orderedProfiles[i];
                let dir = "/images/SMP/"+sm+"_bw.svg";
                allSMP.push(
                    <button key={sm} type="submit" onClick={() => this.formPopUp(sm)} className="profile-button">
                        <img type="submit" className="profile-button-img" src={dir}/>
                    </button>);
            }
        }

        console.log('existingSMP: ', existingSMP);

        // allow user to edit his own profile page if a user is logged in
        console.log(`User permissions: this.props.userLoggedin = ${this.props.userLoggedin}, this.user = ${this.user}`);
        const allowEdit = (this.props.userLoggedin != null && this.props.userLoggedin == this.user) ? true : false;
        console.log("Can I edit this profile page now? ", allowEdit);

        console.log("User found! Rendering UserProfilePage.");
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
                    <h2 className="profile-name">{this.userRealname}</h2>
                    <p className="profile-bio">{this.user}'s dummy bio... </p>
                    {allSMP}
                    <button type="submit" className="profile-edit-button" onClick={this.finishEdit}>Finish</button>
                </div>);
        } else if (this.state.currentPage == 3) {
            console.log("in state 3");
            return (
                <div>
                    <h2 className="profile-name">{this.userRealname}</h2>
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
