import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { UserSignupForm } from './components/UserSignupForm.jsx';
/* import { IndexPage } from './components/IndexPage.jsx';*/

class Example extends React.Component {
    render(match) {
	console.log('User page render() called.');
	return (
	    <div>
	      Hello, ${this.props.location.pathname}!
	    </div>
	);
    }
}

class IndexPage extends React.Component {
    render(match) {
	/* return (indexPageContents);*/
	console.log('Index page render() called.');
	return (
	    <div>
	    Hello landing page!
	    </div>
	);
    }
}

ReactDOM.render((
    <Router>
    <div>
    <Route exact path='/landing' component={IndexPage}/>
    <Route exact path='/user' component={Example}/>
    </div>
    </Router>
), document.getElementById('root'));

