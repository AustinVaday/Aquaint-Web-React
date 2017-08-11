import React from 'react';

export class NavBar extends React.Component {
    // See: https://facebook.github.io/react/docs/forms.html
    constructor(props) {
        super(props);
        console.log(props.user);
        this.user = props.user;
        this.userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + this.user;
        this.userProfileUrl = "http://aquaint.us/" + this.user;
    }

    render() {

      // If user exists, display username in upper right corner and picture!
      if (this.user) {
        console.log("hello exists");
        return (
          <nav className="navbar navbar-fixed-top">
            <div className="container_fluid">
              <a className="navbar-brand goto" href="index.html#wrap"> <img src="./images/logo.svg" alt="Your logo" height="38" width="152" /> </a>
                <ul className="nav">
                  <li><a href={this.userProfileUrl}>{this.user}</a> </li>
                </ul>
                <a className="navbar-user-image" href={this.userProfileUrl}>
                  <img src={this.userImage} alt="Your username" className="img-circle" height="38" width="38" />
                </a>
            </div>
          </nav>
        );
      } else { // Display default
        console.log("Hello does not exist");
        return (
          <nav className="navbar navbar-fixed-top">
            <div className="container_fluid">
              <a className="navbar-brand goto" href="index.html#wrap"> <img src="./images/logo.svg" alt="Your logo" height="38" width="152" /> </a>
              <a className="contact-btn icon-envelope" data-toggle="modal" data-target="#modalContact"></a>
              <button className="navbar-toggle menu-collapse-btn collapsed" data-toggle="collapse" data-target=".navMenuCollapse"> <span className="icon-bar"></span> <span className="icon-bar"></span> <span className="icon-bar"></span> </button>
              <div className="collapse navbar-collapse navMenuCollapse">
                  <ul className="nav">
                <li><a href="#Aquaint">{this.user}</a> </li>
                <li><a href="#getAquainted">Aquaint Code</a> </li>
                <li><a href="#features">Aqualytics</a></li>
                <li><a href="#social">Stay tuned</a></li>
                <li><a href="http://www.blog.aquaint.us">Blog</a> </li>
                  </ul>
              </div>
            </div>
          </nav>
        );
      }
    }
}
