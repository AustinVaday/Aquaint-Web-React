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
	/*
	let tmp = Object.assign({}, { action.username });
	console.log("Redux LOGIN_USER action.username = ", action.username, "; new state: ", tmp);
	*/
	console.log("Redux LOGIN_USER: action.username = ", action.username);
	return action.username;
	
    case LOGOFF_USER:
	return null;
	
    default:
	return state;
    }
}

export const aquaintApp = combineReducers({
    userAuth
});
