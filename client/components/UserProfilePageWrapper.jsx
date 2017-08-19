import React from 'react';
import ReactDOM from 'react-dom';
import GetNavBar from './GetNavBar.jsx';
import { UserProfilePage } from './UserProfilePage.jsx';

export class UserProfilePageWrapper extends React.Component {

  constructor(props) {
  	super(props);
  	console.log("UserProfilePageWrapper(NEW) constructor called. Props: ", this.props);
  	console.log("It has access to AWS SDK global instance: ", AWS);
  }

  render() {
    // Get username by removing the backslash character in the beginning
    var user = this.props.match.url.substring(1);
    var userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + user;
    var userScanCodeImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/scancodes/" + user;
    return (
      <div>
        <GetNavBar />
          <header id = "full-intro" className = "intro-block" >
            <div className="container">
              <div className="profile-section">
                <img src={userImage} className="profile-picture" />
                <UserProfilePage {...this.props} />
              </div>
            </div>
          </header>
     </div>
    );
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
