import React from 'react';
import { UserSignupForm } from './UserSignupForm.jsx';

let indexPageContents = (

    <div>
	{/* NAVIGATION BEGIN */}
	<nav class="navbar navbar-fixed-top">
	    <div class="container_fluid">
		<a class="navbar-brand goto" href="index.html#wrap"> <img src="./images/logo.svg" alt="Your logo" height="38" width="152" /> </a>
		<a class="contact-btn icon-envelope" data-toggle="modal" data-target="#modalContact"></a>
		<button class="navbar-toggle menu-collapse-btn collapsed" data-toggle="collapse" data-target=".navMenuCollapse"> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
		<div class="collapse navbar-collapse navMenuCollapse">
		    <ul class="nav">
			<li><a href="#Aquaint">Aquaint</a> </li>
			<li><a href="#getAquainted">Aquaint Code</a> </li>
			<li><a href="#features">Aqualytics</a></li>
			<li><a href="#social">Stay tuned</a></li>
			<li><a href="http://www.blog.aquaint.us">Blog</a> </li>
		    </ul>
		</div>
	    </div>
	</nav>
	{/* NAVIGAION END */}


	{/* INTRO BEGIN */}
	<header id="full-intro" class="intro-block">
	    <div class="container">
		<div class="row">
		    <div class="col-md-4 col-sm-12">
			{/* ReactJS interactive form of user authentication (login or sign-up) */}
			<div id="userAuth"></div>

			<div class="container-fluid" style="float:left" id="aquaint-login">
			    <form action="./scripts/subscribe.php" method="post" id="subscribe_form">
				<div class="input-group">
				</div>
			    </form>
			</div>

		    </div>
		    <div class="col-md-8 hidden-sm hidden-xs">
			<div class="intro-screen wow bounceInUp" data-wow-delay="0.5s">
			    <img height="80%" src="./images/app_demo_landing.png" />
			</div>
		    </div>
		</div>
	    </div>

	    {/*Learn more button*/}
	    <a href="#getAquainted">
		<div class="arrow bounce hidden-xs"></div>
		<div class="arrowSmallScreen bounce visible-xs"></div>
	    </a>
	</header>
	{/* INTRO END */}




	<section id="inspire" class="bg-picture2">
	    <div class="container">
		<h2 class="slogan white"> Transform the way you share social media. </h2>
	    </div>
	</section>

	<section id="Aquaint" class="img-block-2col">
	    <div class="container">
		<div class="row">
		    <div class="col-sm-6">
			<div class="title">
			    <h2>Aquaint</h2>
			</div>

			<ul>
			    <li>
				<h3 class="color">Share All Social Media Handles</h3>
				<p>Gone are the days placing social media emblems on advertising, YouTube videos, and websites. The future is here! Clean up your posts by sharing one scan code to share all social media handles at the same time.  </p>
			    </li>
			    <li>
				<h3 class="color">Benefits for Advertisers and Viewers</h3>
				<p>It is expected that viewers go on each social platform separately to add a person or company and this never happens. With Aquaint, companies will gain an even following across all platforms and users will be able to acess all accounts seamlessly. </p>
			    </li>
			    <li>
				<h3 class="color">Available on Web and Mobile </h3>
				<p>Use Aquaint on any device or computer. </p>
			    </li>

			</ul>
		    </div>
		    <div class="col-sm-6">
			<div class="screen-couple-right wow fadeInRightBig">
			    <img class="screen above" src="./images/iPhone-PopUpProfile.png" alt="" height="622" width="350" />

			</div>
		    </div>
		</div>
	    </div>
	</section>

	<section id="inspire" class="bg-picture1">
	    <div class="container">
		<h2 class="slogan white"> All your handles in one place. </h2>
	    </div>
	</section>

	{/* FEATURES BEGIN */}
	<section id="getAquainted" class="img-block-3col bg-color2">
	    <div class="title">
		<h2 class="white">All-In-One Social Code</h2>
		<p>Connect easier than ever before.</p>

	    </div>
	    <div class="container">
		<div class="row">
		    <div class="col-sm-6 col-sm-push-6">

			<ul class="item-list-left wow fadeInRight" style="padding-top: 60px;">
			    <li>
				<h4 class="white">
				    <img class="emblem-white-icon" src="./images/emblem-white.svg"></img>
				    <b>Your Own Aesthetic Aquaint Code</b>
				</h4>
				{/* <p font-style:"22px">Easily share social media profiles on your advertising campaigns, social media profiles, Youtube videos and more! </p> */}
			    </li>
			    <li>
				<h4 class="white">
				    <img class="emblem-white-icon" src="./images/emblem-white.svg"></img>
				    <b>Profile views</b>
				</h4>
				{/* <p font-style:22px>Aquaint allows you to understand how effective your marketing campaigns are by sharing your unique Aquaint code. This allows you to adjust marketing tactics to produce better results and gain higher traffic. </p */}>
			    </li>
			    <li>
				<h4 class="white">
				    <img class="emblem-white-icon" src="./images/emblem-white.svg"></img>
				    <b>Engagements</b>
				</h4>
				{/* <p font-style:22px>Our advanced technology provides engagement analytics to see how many people are clicking on each of your social media profiles. </p> */}
			    </li>
			</ul>
		    </div>
		    <div class="col-sm-6 col-sm-pull-6">
			<div class="screen-couple-right wow fadeInLeftBig animated" style="visibility: visible;">
			    <img class="screen" src="./images/iPhone-AquaintQRCode.png" alt="" height="622" width="320" />

			</div>
		    </div>
		</div>
	    </div>
	</section>
	{/* FEATURES END */}

	<section id="inspire1" class=" bg-picture">
	    <div class="container">
		<h2 class="slogan white">The new era of <b>Social Networking</b> for <b>Social Media</b>. </h2>
	    </div>
	</section>

	{/* BENEFITS1 BEGIN */}
	<section id="features" class="img-block-2col">
	    <div class="container">
		<div class="row">
		    <div class="col-sm-6">
			<div class="title">
			    <h2>Aqualytics</h2>
			</div>

			<ul>
			    <li>
				<h3 class="color">More Data</h3>
				<p>Our premium package provides detailed analytics ranging from location, age, and gender. This is perfect for companies, influencers, or anyone trying to build a large and even following across all platforms.  </p>
			    </li>
			    <li>
				<h3 class="color">Engagement Breakdown</h3>
				<p>Users are able to see which social profiles are their most popular and most clicked profiles. </p>
			    </li>
			    <li>
				<h3 class="color">Location and Age</h3>
				<p>This allows companies and influencers to understand which locations are most interested in their social media profiles allowing you to adjust emphasis in certain locations. You are also able to understand the age range of your audience. </p>
			    </li>
			</ul>
		    </div>
		    <div class="col-sm-6">
			<div class="screen-couple-right wow fadeInRightBig">
			    <img class="screen above" src="./images/iPhone-MoreDataAquaint2.png" alt="" height="622" width="350" />
			</div>
		    </div>
		</div>
	    </div>
	</section>
	{/* BENEFITS1 END */}

	{/* SOCIAL BEGIN */}
	<section id="social" class="bg-color3">
	    <div class="container-fluid">
		<div class="title">
		    <h2>Stay tuned</h2>
		    <p>Follow us on social networks, while we work to improve yours. </p>
		</div>
		<ul class="soc-list wow flipInX">
		    <li><a href="#" onclick='window.open("https://twitter.com/AquaintApp");return false;'><i class="icon soc-icon-twitter"></i></a></li>
		    <li><a href="#" onclick='window.open("https://www.facebook.com/aquaintapp");return false;'><i class="icon soc-icon-facebook"></i></a></li>
		    <li><a href="#" onclick='window.open("https://instagram.com/aquaintapp");return false;'><i class="icon soc-icon-instagram"></i></a></li>
		</ul>

	    </div>
	</section>
	{/* SOCIAL END */}

	{/* FOOTER BEGIN */}
	<footer id="footer">
	    <div class="container">
		<a href="index.html#wrap" class="logo goto"> <img src="./images/logo_small.svg" alt="Your Logo" height="50" width="200" /> </a>
		<p class="copyright">&copy; 2015-2017 Aquaint, Inc. </p>
	    </div>
	</footer>
	{/* FOOTER END */}

	{/* MODALS BEGIN*/}

	{/* subscribe modal*/}
	<div class="modal fade" id="modalMessage" tabindex="-1" role="dialog" aria-hidden="true">
	    <div class="modal-dialog">
		<div class="modal-content">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3 class="modal-title"></h3>
		</div>
	    </div>
	</div>

	{/* contact modal*/}
	<div class="modal fade" id="modalContact" tabindex="-1" role="dialog" aria-hidden="true">
	    <div class="modal-dialog">
		<div class="modal-content">
		    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		    <h3 class="modal-title">Contact</h3>
		    <form action="./scripts/contact.php" role="form" id="contact_form">
			<div class="form-group">
			    <input type="text" class="form-control" id="contact_name" placeholder="Full name" name="name"/>
			</div>
			<div class="form-group">
			    <input type="email" class="form-control" id="contact_email" placeholder="Email Address" name="email"/>
			</div>
			<div class="form-group">
			    <textarea class="form-control" rows="3" placeholder="Your message or question" id="contact_message" name="message"></textarea>
			</div>
			<button type="submit" id="contact_submit" data-loading-text="&bull;&bull;&bull;"> <i class="icon icon-paper-plane"></i></button>
		    </form>
		</div>
	    </div>
	</div>

	{/* MODALS END*/}
    </div>
    
);

export class IndexPage extends React.Component {
    render(match) {
	console.log('Index page render() called.');
	return (indexPageContents);
    }
}

