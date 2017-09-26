import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router';

import GetNavBar from './GetNavBar.jsx';
import GetUserProfilePage from './GetUserProfilePage.jsx';
import { UserNotFound } from './error/UserNotFound.jsx';

export class UserProfilePageWrapper extends React.Component {

    constructor(props) {
        super(props);
        console.log("UserProfilePageWrapper(NEW) constructor called. Props: ", this.props);
        console.log("It has access to AWS SDK global instance: ", AWS);

        // Get username from the route
        this.user = this.props.match.params.username;
        this.userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + this.user;
        this.userScanCodeImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/scancodes/" + this.user;

        this.state = {
            userImageDisplay: this.userImage,
            userNotFound: null,
            userRealname: null,
            userSmpDict: {}
        };

        // periodically show user profile image and user scan code image
        var imageIntervalId = setInterval(function() {
            //console.log("UserImage interval function called; current image displayed: ", this.state.userImageDisplay);
            //console.log("this.userImage = ", this.userImage, "; this.userScanCodeImage = ", this.userScanCodeImage);

            if (this.state.userImageDisplay == this.userImage) {
                if(this._isMounted) this.setState({userImageDisplay: this.userScanCodeImage});
            } else if (this.state.userImageDisplay == this.userScanCodeImage) {
                if(this._isMounted) this.setState({userImageDisplay: this.userImage});
            }
        }.bind(this), 3000);  // every 3 seconds

        this.getUserSmpDict();
    }

    componentDidMount() {
        // Need to keep track of whether the component is mounted to protect setState() calls
        // when we redirect to error page. Otherwise it'll throw errors
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
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
                console.log("Error accessing DynamoDB table: ", err, "; AWS.config.credentials: ", AWS.config.credentials);
                // NOTE: temporary solution to possible race conditions on
                // setting AWS credentials, when user logs out and the current profile page is automatically refreshed,
                // or an un-logged in user goes to a profile page
                // we simply wait for 2 seconds and try fetching from Dynamo again
                console.log("WARNING: possible race condition, re-accessing DynamoDB soon...");
                setTimeout(function(){
                    this.getUserSmpDict();
                }.bind(this), 2000);

            } else {
                console.log("User entry in aquaint-user table:", data);

                if (!data.Item) {
                    console.log("User entry does not exist in aquaint-users Dynamo table. Could not find user:", this.user);
                    if (this._isMounted) {
                        this._isMounted = false;
                        this.setState({ userNotFound: true });
                    }
                    return;
                } else {
                    console.log("User exists in aquaint-users Dynamo table.");
                    if (this._isMounted) this.setState({ userNotFound: false });
                }

                if (this.state.userRealname == null) {
                    if (this._isMounted) this.setState({ userRealname: data.Item.realname.S });
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

                if (this._isMounted) this.setState({ userSmpDict: socialDict });
                console.log("GetUserSmpDict: ", socialDict);
            }
        }.bind(this));
    }

    render() {
        //User data to send to UserProfilePage Component
        var userData = {
            userRealname: this.state.userRealname,
            userSmpDict: this.state.userSmpDict
        };

        if (this.state.userNotFound && !this.state.userRealname) {
            // If user doesn't exist then render the error page
            return (
                <div>
                    <GetNavBar />
                    <header id = "full-intro" className = "intro-block" >
                        <UserNotFound {...this.props} />
                    </header>
                </div>
            );
        } else {
            return (
                <div>
                    <GetNavBar />
                    <header id = "full-intro" className = "intro-block" >
                        <div className="container">
                            <div className="profile-section">
                                {/* Check to make sure we don't render the img and UserProfilePage Component if the user is not found */}
                                { !this.state.userNotFound && this.state.userRealname &&
                                <img src={this.state.userImageDisplay} className="profile-picture" />
                                }
                                { !this.state.userNotFound && this.state.userRealname &&
                                <GetUserProfilePage {...this.props} userData={userData} />
                                }
                            </div>
                        </div>
                    </header>
                </div>
            );
        }
    }
}
