import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { UserSignupForm } from './components/UserSignupForm.jsx';
import { indexPageContents } from './components/IndexPage.jsx';

class Example extends React.Component {
    render(match) {
	return (
	    <div>
	      Hello, ${this.props.location.pathname}!
	    </div>
	);
    }
}

class IndexPage extends React.Component {
    render(match) {
	return (indexPageContents);
    }
}

ReactDOM.render((
    <Router>
      <div>
	<Route exact path='/' component={IndexPage}/>
	<Route exact path='/user' component={Example}/>
      </div>
    </Router>
), document.getElementById('root'));

