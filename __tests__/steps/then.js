require('dotenv').config()
const AWS = require('aws-sdk')

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

const remove_user_from_UsersTable = async (id) => {
  const DynamoDB = new AWS.DynamoDB.DocumentClient();
  try {
    await DynamoDB.delete({
      TableName: process.env.USERS_TABLE,
      Key: {
        id
      }
    }).promise()
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  user_exists_in_UsersTable,
  remove_user_from_UsersTable
}