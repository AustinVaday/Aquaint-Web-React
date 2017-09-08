// ******** DEPRECATED
// This file is for demonstration only. Not used in the project.
// ********

import React from 'react';
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import * as AwsConfig from './AwsConfig';

// Initialize the Amazon Cognito credentials provider
var AWS = require('aws-sdk');
AWS.config.region = AwsConfig.COGNITO_REGION; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: AwsConfig.COGNITO_IDENTITY_POOL_ID});

// React Component for User Signup, including registering a new user on AWS services
export class DisplayProfile extends React.Component {
    render() {
      var dynamodb = new AWS.DynamoDB();

      // **** FETCH AWS DYNAMO DATA ****
      var getParams = {
        TableName: "aquaint-users",
        Key: {
          "username": {
            S: "austin"
          }
        }
      };

      dynamodb.getItem(getParams, function(error, data) {
        if (error){
          console.log(error, error.stack);
        } else {
          console.log(data);
          console.log("username: " + data.Item.username.S);
          console.log("real name: " + data.Item.realname.S);
          console.log("isprivate: " + data.Item.isprivate.N);
          console.log("isverified: " + data.Item.isverified.N);
          console.log("fbuid: " + data.Item.fbuid.S);
          console.log("accounts:");
          for (var socialMapElem in data.Item.accounts.M) {
            for (var socialId in data.Item.accounts.M[socialMapElem].L) {
              console.log(socialMapElem + ": " + data.Item.accounts.M[socialMapElem].L[socialId].S);
            }
          }
        }
      });

      // **** STORE AWS DYNAMO DATA ****
      var putParams =
      {
        TableName: "aquaint-users",
        Item: {
          "username": {
            S: "yolo123123"
          },
          "realname": {
            S: "Yolo Test 123"
          },
          "isprivate": {
            N: "0"
          },
          "accounts": {
            M: {
              "facebook": {
                L: [
                  {
                    S: "fb9999999999"
                  },
                  {
                    S: "fb0000000000"
                  }
                ]
              },
              "snapchat": {
                L: [
                  {
                    S: "snap9999999999"
                  },
                  {
                    S: "snap0000000000"
                  }
                ]
              },
            }
          }
        }
      };

      dynamodb.putItem(putParams, function(error, data) {
        if (error) {
          console.log(error, error.stack);
        } else {
          console.log("DATA STORED TO DYNAMO! CHECK DYNAMO TO VERIFY.");
          console.log(data);
        }
      });


      return (
          <h3> Hi please check out DisplayProfile.jsx for DynamoDB examples!</h3>
      );
      return null;
    }
}
