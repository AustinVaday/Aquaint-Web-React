import React from 'react';
import ReactDOM from 'react-dom';
import { App, UserLoginForm, UserSignupForm } from './components/App.jsx';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<UserSignupForm />, document.getElementById('userlogin'));
