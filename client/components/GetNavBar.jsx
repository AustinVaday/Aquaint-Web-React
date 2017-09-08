import { connect } from 'react-redux';
import { logoffUser } from '../states/actions';
import { NavBar } from './NavBar.jsx';

const mapStateToProps = state => {
    return {
	user: state.userAuth
    };
};

const mapDispatchToProps = dispatch => {
    return {
	onSignoutClick: () => {
	    dispatch(logoffUser());
	}
    };
};

const GetNavBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(NavBar);

export default GetNavBar;
