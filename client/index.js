import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { UserSignupForm } from './components/UserSignupForm.jsx';

class Example extends React.Component {
    render(match) {
	return (
	    <div>
	      Hello, ${this.props.location.pathname}!
	    </div>
	);
    }
}

ReactDOM.render((
    <Router>
      <div>
	<Route exact path='/' component={UserSignupForm}/>
	<Route path='/' component={Example}/>
      </div>
    </Router>
), document.getElementById('userAuth'));

