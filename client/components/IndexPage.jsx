import React from 'react';
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';

import UserSignupForm from './UserSignupForm.jsx';
import GetNavBar from './GetNavBar.jsx';

export class IndexPageLocal extends React.Component {

    constructor(props) {
        super(props);
        console.log("IndexPage constructor called. Props: ", this.props);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("IndexPage componentDidUpdate. State: ", this.state);
    }

    render(match) {
        console.log('Index page render() called.');

        // if the user is logged in, we don't show index page anymore
        // and redirects to the user's own profile page
        if (this.props.user != null) {
            const redirectUri = '/' + this.props.user;
            return (
                <Redirect to={{pathname: redirectUri}} />
            );
        }

        return (

            <div>
              {/* NAVIGATION BEGIN */}
              <GetNavBar />
              {/* NAVIGAION END */}

              {/* INTRO BEGIN */}
              <header id="full-intro" className="intro-block">
                <div className="container">
                  <div className="row">
                    <div className="col-md-4 col-sm-12">
                      {/* ReactJS interactive form of user authentication (login or sign-up) */}
                      <div id="userAuth"><UserSignupForm /></div>

                      <div className="container-fluid" style={{float:'left'}} id="aquaint-login">
                        <form action="/scripts/subscribe.php" method="post" id="subscribe_form">
                          <div className="input-group">
                          </div>
                        </form>
                      </div>

                    </div>
                    <div className="col-md-8 hidden-sm hidden-xs">
                      <div className="intro-screen wow bounceInUp" data-wow-delay="0.5s">
                        <img height="80%" src="/images/app_demo_landing.png" />
                      </div>
                    </div>
                  </div>
                </div>

                {/*Learn more button*/}
                <a href="#getAquainted">
                  <div className="arrow bounce hidden-xs"></div>
                  <div className="arrowSmallScreen bounce visible-xs"></div>
                </a>
              </header>
              {/* INTRO END */}

              <section id="inspire" className="bg-picture2">
                <div className="container">
                  <h2 className="slogan white"> Transform the way you share social media. </h2>
                </div>
              </section>

              <section id="Aquaint" className="img-block-2col">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="title">
                        <h2>Aquaint</h2>
                      </div>

                      <ul>
                        <li>
                          <h3 className="color">Share All Social Media Handles</h3>
                          <p>Gone are the days placing social media emblems on advertising, YouTube videos, and websites. The future is here! Clean up your posts by sharing one scan code to share all social media handles at the same time.  </p>
                        </li>
                        <li>
                          <h3 className="color">Benefits for Advertisers and Viewers</h3>
                          <p>It is expected that viewers go on each social platform separately to add a person or company and this never happens. With Aquaint, companies will gain an even following across all platforms and users will be able to acess all accounts seamlessly. </p>
                        </li>
                        <li>
                          <h3 className="color">Available on Web and Mobile </h3>
                          <p>Use Aquaint on any device or computer. </p>
                        </li>

                      </ul>
                    </div>
                    <div className="col-sm-6">
                      <div className="screen-couple-right wow fadeInRightBig">
                        <img className="screen above" src="/images/iPhone-PopUpProfile.png" alt="" height="622" width="350" />

                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section id="inspire" className="bg-picture1">
                <div className="container">
                  <h2 className="slogan white"> All your handles in one place. </h2>
                </div>
              </section>

              {/* FEATURES BEGIN */}
              <section id="getAquainted" className="img-block-3col bg-color2">
                <div className="title">
                  <h2 className="white">All-In-One Social Code</h2>
                  <p>Connect easier than ever before.</p>

                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-sm-6 col-sm-push-6">

                      <ul className="item-list-left wow fadeInRight" style={{padding: '60px'}}>
                        <li>
                          <h4 className="white">
                            <img className="emblem-white-icon" src="/images/emblem-white.svg"></img>
                            <b>Your Own Aesthetic Aquaint Code</b>
                          </h4>
                          {/* <p font-style:"22px">Easily share social media profiles on your advertising campaigns, social media profiles, Youtube videos and more! </p> */}
                        </li>
                        <li>
                          <h4 className="white">
                            <img className="emblem-white-icon" src="/images/emblem-white.svg"></img>
                            <b>Profile views</b>
                          </h4>
                          {/* <p font-style:22px>Aquaint allows you to understand how effective your marketing campaigns are by sharing your unique Aquaint code. This allows you to adjust marketing tactics to produce better results and gain higher traffic. </p */}>
                        </li>
                        <li>
                          <h4 className="white">
                            <img className="emblem-white-icon" src="/images/emblem-white.svg"></img>
                            <b>Engagements</b>
                          </h4>
                          {/* <p font-style:22px>Our advanced technology provides engagement analytics to see how many people are clicking on each of your social media profiles. </p> */}
                        </li>
                      </ul>
                    </div>
                    <div className="col-sm-6 col-sm-pull-6">
                      <div className="screen-couple-right wow fadeInLeftBig animated" style={{visibility: 'visible'}}>
                        <img className="screen" src="/images/iPhone-AquaintQRCode.png" alt="" height="622" width="320" />

                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* FEATURES END */}

              <section id="inspire1" className=" bg-picture">
                <div className="container">
                  <h2 className="slogan white">The new era of <b>Social Networking</b> for <b>Social Media</b>. </h2>
                </div>
              </section>

              {/* BENEFITS1 BEGIN */}
              <section id="features" className="img-block-2col">
                <div className="container">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="title">
                        <h2>Aqualytics</h2>
                      </div>

                      <ul>
                        <li>
                          <h3 className="color">More Data</h3>
                          <p>Our premium package provides detailed analytics ranging from location, age, and gender. This is perfect for companies, influencers, or anyone trying to build a large and even following across all platforms.  </p>
                        </li>
                        <li>
                          <h3 className="color">Engagement Breakdown</h3>
                          <p>Users are able to see which social profiles are their most popular and most clicked profiles. </p>
                        </li>
                        <li>
                          <h3 className="color">Location and Age</h3>
                          <p>This allows companies and influencers to understand which locations are most interested in their social media profiles allowing you to adjust emphasis in certain locations. You are also able to understand the age range of your audience. </p>
                        </li>
                      </ul>
                    </div>
                    <div className="col-sm-6">
                      <div className="screen-couple-right wow fadeInRightBig">
                        <img className="screen above" src="/images/iPhone-MoreDataAquaint2.png" alt="" height="622" width="350" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              {/* BENEFITS1 END */}

              {/* SOCIAL BEGIN */}
              <section id="social" className="bg-color3">
                <div className="container-fluid">
                  <div className="title">
                    <h2>Stay tuned</h2>
                    <p>Follow us on social networks, while we work to improve yours. </p>
                  </div>
                  <ul className="soc-list wow flipInX">
                    <li><a href="#" onClick={ () => window.open("https://twitter.com/AquaintApp") }><i className="icon soc-icon-twitter"></i></a></li>
                    <li><a href="#" onClick={ () => window.open("https://www.facebook.com/aquaintapp") }><i className="icon soc-icon-facebook"></i></a></li>
                    <li><a href="#" onClick={ () => window.open("https://instagram.com/aquaintapp") }><i className="icon soc-icon-instagram"></i></a></li>
                  </ul>

                </div>
              </section>
              {/* SOCIAL END */}

              {/* FOOTER BEGIN */}
              <footer id="footer">
                <div className="container">
                  <a href="index.html#wrap" className="logo goto"> <img src="/images/logo_small.svg" alt="Your Logo" height="50" width="200" /> </a>
                  <p className="copyright">&copy; 2015-2017 Aquaint, Inc. </p>
                </div>
              </footer>
              {/* FOOTER END */}

              {/* MODALS BEGIN*/}

              {/* subscribe modal*/}
              <div className="modal fade" id="modalMessage" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 className="modal-title"></h3>
                  </div>
                </div>
              </div>

              {/* contact modal*/}
              <div className="modal fade" id="modalContact" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 className="modal-title">Contact</h3>
                    <form action="/scripts/contact.php" role="form" id="contact_form">
                      <div className="form-group">
                        <input type="text" className="form-control" id="contact_name" placeholder="Full name" name="name"/>
                      </div>
                      <div className="form-group">
                        <input type="email" className="form-control" id="contact_email" placeholder="Email Address" name="email"/>
                      </div>
                      <div className="form-group">
                        <textarea className="form-control" rows="3" placeholder="Your message or question" id="contact_message" name="message"></textarea>
                      </div>
                      <button type="submit" id="contact_submit" data-loading-text="&bull;&bull;&bull;"> <i className="icon icon-paper-plane"></i></button>
                    </form>
                  </div>
                </div>
              </div>

              {/* MODALS END*/}
            </div>

        );
    }
}

// connect component to Redux
const mapStateToProps = state => {
    return {
        user: state.userAuth
    };
};

let IndexPage = connect(
    mapStateToProps
)(IndexPageLocal);

export default IndexPage;
