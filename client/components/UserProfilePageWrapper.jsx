import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'react-bootstrap';

import Cropper from 'react-cropper';
//import 'cropperjs/dist/cropper.css';

import GetNavBar from './GetNavBar.jsx';
import GetUserProfilePage from './GetUserProfilePage.jsx';

export class UserProfilePageWrapper extends React.Component {

    constructor(props) {
        super(props);
        console.log("UserProfilePageWrapper(NEW) constructor called. Props: ", this.props);
        console.log("It has access to AWS SDK global instance: ", AWS);

        // Get username by removing the backslash character in the beginning
        this.user = this.props.match.url.substring(1);
        //this.userImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/" + this.user;
        this.userImage = null;
        this.userScanCodeImage = "http://aquaint-userfiles-mobilehub-146546989.s3.amazonaws.com/public/scancodes/" + this.user;

        this.state = {
            userImageDisplay: this.userScanCodeImage,
            openImageCropper: false,
            uploadComplete: true,
            selectedImage: null,
        };

        // periodically show user profile image and user scan code image
        var imageIntervalId = setInterval(function() {
            //console.log("UserImage interval function called; current image displayed: ", this.state.userImageDisplay);
            //console.log("this.userImage = ", this.userImage, "; this.userScanCodeImage = ", this.userScanCodeImage);

            if (this.state.userImageDisplay == this.userImage) {
                this.setState({userImageDisplay: this.userScanCodeImage});
            } else if (this.state.userImageDisplay == this.userScanCodeImage) {
                this.setState({userImageDisplay: this.userImage});
            }
        }.bind(this), 3000);  // every 3 seconds

        this.uploadPhoto = this.uploadPhoto.bind(this);
        this.close = this.close.bind(this);
        this.openImageCropDialog = this.openImageCropDialog.bind(this);
        this.saveCropped = this.saveCropped.bind(this);
	    this.getImageUrl = this.getImageUrl.bind(this);

        this.getImageUrl();
    }

    getImageUrl() {
        var s3 = new AWS.S3();
        var params = {
            Bucket: 'aquaint-userfiles-mobilehub-146546989/public',
            Key: this.user
        };

        s3.getSignedUrl('getObject', params, (function(err, data) {
            if (err) console.log(err, err.stack);
            else {
                console.log('url', data);
                this.setState({userImageDisplay: data});
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
            fileReader.onload = (function(event) {
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

        console.log('Converted dataURL to blob', blob);

        return blob;
    }

    uploadPhoto(image) {
        console.log('Uploading Image to S3');
        this.setState({uploadComplete: false});
        var upload = new AWS.S3.ManagedUpload({
            params: { Bucket: 'aquaint-userfiles-mobilehub-146546989/public', Key: this.user, Body: image }
        });
        upload.send((function (err, res) {
            console.log(err, res);
            //TODO: Find a better way to reload cached image without reloading whole page
            //      as well as reloading pic in Navbar along w/ profile page
            window.location.reload();
        }).bind(this));
    }

    close() {
        console.log("Modal close() called");
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

    render() {
        const hide = {
            display: 'none'
        };

        if (this.state.uploadComplete) {
            return (
                <div>
                    <GetNavBar />
                    <header id = "full-intro" className = "intro-block" >
                        <div className="container">
                            <div className="profile-section">
                                <input type="file" id="fileInput" accept="image/*" onChange={this.openImageCropDialog} style={hide} />
                                <img src={this.state.userImageDisplay} className="profile-picture" onClick={this.openFileBrowserDialog} />
                                <GetUserProfilePage {...this.props} />
                                {this.state.selectedImage && this.renderImageCropModal()}
                            </div>
                        </div>
                    </header>
                </div>
            );
        } else {
            return (
                <div id="preloader">
                    <div className="emblem"></div>
                </div>
            );
        }
    }
}
