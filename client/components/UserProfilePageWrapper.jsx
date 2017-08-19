import React from 'react';
import ReactDOM from 'react-dom';
import GetNavBar from './GetNavBar.jsx';
import UserProfilePage from './UserProfilePage.jsx';

export class UserProfilePageWrapper extends React.Component {

  constructor(props) {
  	super(props);
  	console.log("UserProfilePageWrapper(NEW) constructor called. Props: ", this.props);
  	console.log("It has access to AWS SDK global instance: ", AWS);
  }

  render() {
    return (
      <div>
        <GetNavBar />
          <header id = "full-intro" className = "intro-block" >
            <div className="container">
              <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <UserProfilePage />
                  </div>
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
