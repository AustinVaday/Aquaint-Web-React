import { LOGIN_USER, LOGOFF_USER } from './userAuth_actions';

const initialState = {
    isAuthorized: false,
    username: null
};

function userAuth(state = initialState, action) {
    switch (action.type) {
    case LOGIN_USER:
	return Object.assign({}. state, {
	    isAuthorized: true,
	    username: action.username
	});
	
    case LOGOFF_USER:
	return Object.assign({}, state, {
	    isAuthorized: false
	});
	
    default:
	return state;
    }
}
