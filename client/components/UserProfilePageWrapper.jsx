import React from 'react';
import ReactDOM from 'react-dom';

import GetNavBar from './GetNavBar.jsx';
import GetUserProfilePage from './GetUserProfilePage.jsx';

export class UserProfilePageWrapper extends React.Component {

  constructor(props) {
      super(props);
      console.log("UserProfilePageWrapper(NEW) constructor called. Props: ", this.props);
      console.log("It has access to AWS SDK global instance: ", AWS);

      // Get username by removing the backslash character in the beginning
      this.user = this.props.match.url.substring(1);
      this.userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + this.user;
      this.userScanCodeImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/scancodes/" + this.user;

      this.state = {
	  userImageDisplay: this.userImage  
      };

      // periodically show user profile image and user scan code image
      var imageIntervalId = setInterval(function() {
	  //console.log("UserImage interval function called; current image displayed: ", this.state.userImageDisplay);
	  //console.log("this.userImage = ", this.userImage, "; this.userScanCodeImage = ", this.userScanCodeImage);
	  
	  if (this.state.userImageDisplay == this.userImage) {
	      this.setState({userImageDisplay: this.userScanCodeImage});
	  } else if (this.state.userImageDisplay == this.userScanCodeImage) {
	      this.setState({userImageDisplay: this.userImage});
	  } 
      }.bind(this), 3000);  // every 3 seconds

  }

    render() {
	return (
	    <div>
              <GetNavBar />
              <header id = "full-intro" className = "intro-block" >
		<div className="container">
		  <div className="profile-section">
                    <img src={this.state.userImageDisplay} className="profile-picture" />
                    <GetUserProfilePage {...this.props} />
		  </div>
		</div>
              </header>
	    </div>
	);
    }
}

