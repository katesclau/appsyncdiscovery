require('dotenv').config()
const AWS = require('aws-sdk')
const http = require('axios')
const fs = require('fs')

const user_exists_in_UsersTable = async (id) => {
  const DynamoDB = new AWS.DynamoDB.DocumentClient();

  try {
    const resp = await DynamoDB.get({
      TableName: process.env.USERS_TABLE,
      Key: {
        id
      }
    }).promise()
    expect(resp.Item).toBeTruthy()
  
    return resp.Item;
  } catch (error) {
    console.log(error)
    return null
  }
}

const remove_user = async (id) => {
  const DynamoDB = new AWS.DynamoDB.DocumentClient();
  const cognito = new AWS.CognitoIdentityServiceProvider()
  const userPoolId = process.env.COGNITO_USER_POOL_ID
  try {
    await DynamoDB.delete({
      TableName: process.env.USERS_TABLE,
      Key: {
        id
      }
    }).promise()
    await cognito.adminDeleteUser({
      UserPoolId: userPoolId,
      Username: id
    }).promise()
  } catch (error) {
    console.log(error)
  }
}

const user_can_upload_image_to_url = async (url, filepath, contentType) => {
  const data = fs.readFileSync(filepath)
  await http({
    method: 'put',
    url,
    headers: {
      'Content-Type': contentType
    },
    data
  })

  console.log('uploaded image to', url)
}

const user_can_download_image_from = async (url) => {
  const resp = await http(url)

  console.log('downloaded image from', url)

  return resp.data
}

module.exports = {
  user_exists_in_UsersTable,
  remove_user,
  user_can_upload_image_to_url,
  user_can_download_image_from
}