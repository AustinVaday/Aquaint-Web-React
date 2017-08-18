import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { aquaintApp } from './states/reducers';
import { UserSignupForm } from './components/UserSignupForm.jsx';
import { DisplayProfile } from './components/DisplayProfile.jsx';
import { IndexPage } from './components/IndexPage.jsx';
import { UserProfilePage } from './components/UserProfilePage.jsx';

// Redux store, which should be one and only one instance in the app 
let store = createStore(aquaintApp);

// A class can be a component passed to react-router too, besides a function
// "match" parameters are passed in as props in this case
ReactDOM.render((
    <Router>
      <Provider store={store}>
	<div>
	  <Route exact path="/" component={IndexPage}/>
	  <Route path="/:username" component={UserProfilePage}/>
	</div>
      </Provider>
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
