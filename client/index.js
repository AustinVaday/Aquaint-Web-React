import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { UserSignupForm } from './components/UserSignupForm.jsx';
import { DisplayProfile } from './components/DisplayProfile.jsx';
import { IndexPage } from './components/IndexPage.jsx';

// A class can be a component passed to react-router too, besides a function
// "match" parameters are passed in as props in this case
class UserProfileExample extends React.Component {
    constructor(props) {
	super(props);
    }
    
    render() {
	console.log(this.props);
	console.log(`User page URI: ${this.props.location.pathname}`);
	return (
	    <div>
		Welcome to your profile page, {this.props.match.params.username}! 
	    </div>
	);
    }
}

ReactDOM.render((
    <Router>
      <div>
	<Route exact path="/" component={IndexPage}/>
	<Route path="/:username" component={UserProfileExample}/>
      </div>
    </Router>
), document.getElementById('root'));

// ReactDOM.render(<DisplayProfile />, document.getElementById('displayProfileTest'));

/*
class UserProfileExample extends React.Component {
    constructor(props) {
	super(props);
    }
    
    render() {
	//console.log(`User page URI: ${this.props.location.pathname}`);
	return (
	    <div>
		Welcome to your profile page, {this.props.username}! 
	    </div>
	);
    }
}

// Wrapper function to redirect to the actual UserProfile React component
// Because react-router is expecting a function for rendering, not a class
// Othwersie the parameters would not be passed correctly
const UserProfileRoute = ({ match }) => (
    <div>
      <UserProfileExample username={match.params.username}/>
  </div>
)
*/
