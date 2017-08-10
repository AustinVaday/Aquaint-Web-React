import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { UserSignupForm } from './components/UserSignupForm.jsx';

class Example extends React.Compoenent {
    render() {
	return (
	    <div>
	      Hello React!
	    </div>
	);
    }
}

ReactDOM.render(<UserSignupForm />, document.getElementById('userAuth'));

