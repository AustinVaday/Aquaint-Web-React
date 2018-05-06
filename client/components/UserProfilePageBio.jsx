import React from 'react';
import ReactDOM from 'react-dom';

export class UserProfilePageBio extends React.Component {

    constructor(props) {
        super(props);
        console.log("UserProfilePageBio: props = ", this.props);

        this.STATE_SHOW_BIO = 0;
        this.STATE_EDIT_BIO = 1;

        this.state = {
            currentPage: this.STATE_SHOW_BIO,
            userBio: this.props.userData.userRealname + "'s dummy Bio in UserProfilePageBio class."
        }

        // member functions 'this' bindings
        this.fetchBio = this.fetchBio.bind(this);
        this.startEditBio = this.startEditBio.bind(this);
        this.finishEditBio = this.finishEditBio.bind(this);
        this.handleEditBioChange = this.handleEditBioChange.bind(this);
    }

    fetchBio() {

    }

    startEditBio(event) {
        event.preventDefault();
        this.setState({
            currentPage: this.STATE_EDIT_BIO
        });
    }

    finishEditBio(event) {
        event.preventDefault();
        this.setState({
            currentPage: this.STATE_SHOW_BIO
        });
    }

    handleEditBioChange(event) {
        this.setState({ userBio: event.target.value })
    }

    render() {
        if (this.state.currentPage == this.STATE_SHOW_BIO) {
            return (
                <div>
                    <p className="profile-bio">
                        {this.state.userBio}
                        <button type="submit" className="profile-bio-edit-button" onClick={this.startEditBio}>Edit</button>
                    </p>
                </div>
                );

        } else if (this.state.currentPage == this.STATE_EDIT_BIO) {
            return (
                <div>
                    <input type="text" value={this.state.userBio} onChange={this.handleEditBioChange}/>
                    <button type="submit" className="profile-bio-edit-button" onClick={this.finishEditBio}>Done</button>
                </div>
            );
        }
    }

}