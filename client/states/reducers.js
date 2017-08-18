import { combineReducers } from 'redux';
import { LOGIN_USER, LOGOFF_USER } from './actions';

/*
const initialState = {
    username: null
};
*/

// state.userAuth is an username, a string which can be null (if no user is logged in)
function userAuth(state = null, action) {
    switch (action.type) {
    case LOGIN_USER:
	return Object.assign({}, action.username);
	
    case LOGOFF_USER:
	return Object.assign({}, null);
	
    default:
	return state;
    }
}

export const aquaintApp = combineReducers({
    userAuth
});
