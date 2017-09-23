import { connect } from 'react-redux';

import { logoffUser } from '../states/actions';
import UserProfilePage from './UserProfilePage.jsx';

const mapStateToProps = state => {
    return {
        userLoggedin: state.userAuth
    };
};

const GetUserProfilePage = connect(
    mapStateToProps
)(UserProfilePage);

export default GetUserProfilePage;
