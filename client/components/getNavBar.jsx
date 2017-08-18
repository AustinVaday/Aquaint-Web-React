import { connect } from 'react-redux';
import { LogoffUser } from '../states/actions';
import { NavBar } from './NavBar.jsx';

const mapStateToProps = state => {
    return {
	username: state.userAuth
    };
};

const mapDispatchToProps = dispatch => {
    return {
	onSignoutClick: () => {
	    dispatch(logoffUser());
	}
    };
};

export const getNavBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);
