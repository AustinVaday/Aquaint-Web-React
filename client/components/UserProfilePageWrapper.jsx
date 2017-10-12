import React from 'react';
import ReactDOM from 'react-dom';
import {Redirect} from 'react-router';

import {Modal, Button} from 'react-bootstrap';
import Cropper from 'react-cropper';

import GetNavBar from './GetNavBar.jsx';
import GetUserProfilePage from './GetUserProfilePage.jsx';
import {UserNotFound} from "./error/UserNotFound.jsx";

export class UserProfilePageWrapper extends React.Component {

  constructor(props) {
    super(props);
    console.log("UserProfilePageWrapper(NEW) constructor called. Props: ", this.props);
    console.log("It has access to AWS SDK global instance: ", AWS);

    // Get username from the route
    this.user = this.props.match.params.username;
    this.userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + this.user;
    this.userScanCodeImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/scancodes/" + this.user;

    this.state = {
      userImageDisplay: this.userScanCodeImage,
      openImageCropper: false,
      uploadComplete: true,
      selectedImage: null,
      userNotFound: null,
      userRealname: null,
      userSmpDict: {}
    };

    // periodically show user profile image and user scan code image
    var imageIntervalId = setInterval(function () {
      //console.log("UserImage interval function called; current image displayed: ", this.state.userImageDisplay);
      //console.log("this.userImage = ", this.userImage, "; this.userScanCodeImage = ", this.userScanCodeImage);

      if (this.state.userImageDisplay == this.userImage) {
        if (this._isMounted) this.setState({userImageDisplay: this.userScanCodeImage});
      } else if (this.state.userImageDisplay == this.userScanCodeImage) {
        if (this._isMounted) this.setState({userImageDisplay: this.userImage});
      }
    }.bind(this), 3000);  // every 3 seconds

    this.uploadPhoto = this.uploadPhoto.bind(this);
    this.close = this.close.bind(this);
    this.openImageCropDialog = this.openImageCropDialog.bind(this);
    this.saveCropped = this.saveCropped.bind(this);
    this.getImageUrl = this.getImageUrl.bind(this);

    this.getUserSmpDict();
  }

  componentWillMount() {
    this.getImageUrl();
  }

  componentDidMount() {
    // Need to keep track of whether the component is mounted to protect setState() calls
    // when we redirect to error page. Otherwise it'll throw errors
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // get Aquaint user data (real name, social media profiles, etc.) from DynamoDB
  // only needs to be called once in React component's constructor
  getUserSmpDict() {
    var ddb = new AWS.DynamoDB();
    var ddbTableParams = {
      TableName: 'aquaint-users',
      Key: {
        'username': {S: this.user}
      }
    };
    ddb.getItem(ddbTableParams, function (err, data) {
      if (err) {
        console.log("Error accessing DynamoDB table: ", err, "; AWS.config.credentials: ", AWS.config.credentials);
        // NOTE: temporary solution to possible race conditions on
        // setting AWS credentials, when user logs out and the current profile page is automatically refreshed,
        // or an un-logged in user goes to a profile page
        // we simply wait for 2 seconds and try fetching from Dynamo again
        console.log("WARNING: possible race condition, re-accessing DynamoDB soon...");
        setTimeout(function () {
          this.getUserSmpDict();
        }.bind(this), 2000);

      } else {
        console.log("User entry in aquaint-user table:", data);

        if (!data.Item) {
          console.log("User entry does not exist in aquaint-users Dynamo table. Could not find user:", this.user);
          if (this._isMounted) {
            this._isMounted = false;
            this.setState({userNotFound: true});
          }
          return;
        } else {
          console.log("User exists in aquaint-users Dynamo table.");
          if (this._isMounted) this.setState({userNotFound: false});
        }

        if (this.state.userRealname == null) {
          if (this._isMounted) this.setState({userRealname: data.Item.realname.S});
        }

        var socialDict = {};
        if (data.Item.accounts != null) {
          for (var socialMapElem in data.Item.accounts.M) {
            var singleSocialArray = [];
            for (var socialId in data.Item.accounts.M[socialMapElem].L) {
              //console.log(socialMapElem + ": " + data.Item.accounts.M[socialMapElem].L[socialId].S);
              singleSocialArray.push(data.Item.accounts.M[socialMapElem].L[socialId].S);
            }
            socialDict[socialMapElem] = singleSocialArray;
          }
        }

        if (this._isMounted) this.setState({userSmpDict: socialDict});
        console.log("GetUserSmpDict: ", socialDict);
      }
    }.bind(this));
  }

  getImageUrl() {
    var s3 = new AWS.S3();
    var params = {
      Bucket: 'aquaint-userfiles-mobilehub-146546989/public',
      Key: this.user
    };

    s3.getSignedUrl('getObject', params, (function (err, url) {
      if (err) console.log(err, err.stack);
      else {
        this.userImage = url;
        this.setState({
          userImageDisplay: url,
          uploadComplete: true
        });
      }
    }).bind(this));
    /**
     * Saved for documentation on how to get object and convert
     * byte array to base64 string and data URI
     s3.getObject(params, (function(err, data) {
            if (err) console.log(err, err.stack);
            else {
                var base64String = data.Body.toString('base64');
                var uri = 'data:image/jpeg;base64,' + base64String;
		        this.userImage = uri;
            }
        }).bind(this));
     */
  }

  openFileBrowserDialog() {
    document.getElementById('fileInput').click();
  }

  openImageCropDialog() {
    var selectedFile = document.getElementById('fileInput').files[0];
    if (selectedFile !== null) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = (function (event) {
        this.setState({
          selectedImage: event.target.result,
          openImageCropper: true
        });
        // Need to reset the value of input so onChange event triggers everytime
        document.getElementById('fileInput').value = '';
      }).bind(this);
    } else {
      console.log('No image selected');
    }
  }

  dataURLtoBlob(dataURL) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURL.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});

    //console.log('Converted dataURL to blob', blob);

    return blob;
  }

  uploadPhoto(image) {
    console.log('Uploading Image to S3');
    this.setState({uploadComplete: false});
    var upload = new AWS.S3.ManagedUpload({
      params: {Bucket: 'aquaint-userfiles-mobilehub-146546989/public', Key: this.user, Body: image}
    });
    upload.send((function (err, res) {
      if (err) console.log(err, err.stack);
      else this.getImageUrl();
    }).bind(this));
  }

  close() {
    this.setState({
      openImageCropper: false,
      selectedImage: null
    });
  }

  saveCropped() {
    console.log('Saving cropped image');
    this.setState({
      openImageCropper: false,
      selectedImage: null
    });
    var dataURL = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.uploadPhoto(this.dataURLtoBlob(dataURL));
  }

  // Callback method for everytime the image cropper changes
  _crop() {
    // image in dataUrl
    // console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
  }

  renderImageCropModal() {
    return (
      <div className="static-modal">
        <Modal show={this.state.openImageCropper} onHide={this.close} bsSize="large" backdrop="static">
          <Modal.Body>
            <Cropper
              className="cropper-image-center"
              ref="cropper"
              src={this.state.selectedImage}
              style={{height: '60%', width: '60%'}}
              // Cropper.js options
              guides={false}
              background={false}
              crop={this._crop.bind(this)}
              viewMode={2}
              autoCropArea={1}
              modal={false}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.close} bsSize="large">Close</Button>
            <Button onClick={this.saveCropped} bsStyle="primary" bsSize="large">Save</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  renderLoadScreen() {
    return (
      <div id="preloader">
        <div className="emblem"></div>
      </div>
    );
  }

  renderProfilePage() {
    //User data to send to UserProfilePage Component
    var userData = {
      userRealname: this.state.userRealname,
      userSmpDict: this.state.userSmpDict
    };

    //Local CSS style
    const hide = {
      display: 'none'
    };

    return (
      <div>
        <GetNavBar/>
        <header id="full-intro" className="intro-block">
          <div className="container">
            <div className="profile-section">
              {/* Check to make sure we don't render the img and UserProfilePage Component if the user is not found */}
              {!this.state.userNotFound && this.state.userRealname && this.props.userLoggedin &&
              <input type="file" id="fileInput" accept="image/*" onChange={this.openImageCropDialog} style={hide}/>
              }
              {!this.state.userNotFound && this.state.userRealname && this.props.userLoggedin &&
              <img src={this.state.userImageDisplay} className="profile-picture profile-picture-hover"
                   onClick={this.openFileBrowserDialog}/>
              }
              {!this.state.userNotFound && this.state.userRealname && !this.props.userLoggedin &&
              <img src={this.state.userImageDisplay} className="profile-picture" />
              }
              {!this.state.userNotFound && this.state.userRealname &&
              <GetUserProfilePage {...this.props} userData={userData}/>
              }
              {this.state.selectedImage && this.renderImageCropModal()}
            </div>
          </div>
        </header>
      </div>
    );
  }

  renderUserNotFoundPage() {
    return (
      <div>
        <GetNavBar/>
        <header id="full-intro" className="intro-block">
          <UserNotFound {...this.props} />
        </header>
      </div>
    );
  }

  render() {
    console.log(this.props);
    if (this.state.uploadComplete) {
      if (this.state.userNotFound && !this.state.userRealname) {
        return this.renderUserNotFoundPage();
      } else {
        return this.renderProfilePage();
      }
    } else {
      return this.renderLoadScreen()
    }
  }
}
