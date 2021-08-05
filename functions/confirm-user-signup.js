'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient();

const { USERS_TABLE } = process.env;

exports.handler = async (event) => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const { 
      userName: id,
      request: { 
        userAttributes: {
          name,
        }
      }
    } = event;

    const user = {
      id,
      name,
      screenName: `${name.replace(/[^a-zA-Z0-9]/g, "")}`,
      createdAt: new Date().toJSON(),
      tweets: { tweets: [] },
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    };

    await DocumentClient.put({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise();

    return event
  } else {
    return event;
  }
};
