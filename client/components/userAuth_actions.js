/*
  action types
*/
export const LOGIN_USER = 'AUTHENTICATE_USER';
export const LOGOFF_USER = 'LOGOFF_USER';

/*
  action creators
*/
export function loginUser(username) {
    return { type: LOGIN_USER, username };
}

export function logoffUser() {
    return { type: LOGOFF_USER }; 
}

