import {connect} from 'react-redux';

import {UserProfilePageWrapper} from './UserProfilePageWrapper.jsx';

const mapStateToProps = state => {
  return {
    userLoggedin: state.userAuth
  };
};

const GetUserProfilePageWrapper = connect(
  mapStateToProps
)(UserProfilePageWrapper);

export default GetUserProfilePageWrapper;