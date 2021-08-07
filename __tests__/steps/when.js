require('dotenv').config();
const AWS = require('aws-sdk')
const fs = require('fs')
const velocityMapper = require('amplify-appsync-simulator/lib/velocity/value-mapper/mapper')
const velocityTemplate = require('amplify-velocity-template');
const GraphQL = require('../lib/graphql')

const we_invoke_confirmUserSignup = async (username, name, email) => {
  const handler = require('../../functions/confirm-user-signup').handler

  const context = {}
  const event = {
    "version": "1",
    "region": process.env.AWS_REGION,
    "userPoolId": process.env.COGNITO_USER_POOL_ID,
    "userName": username,
    "triggerSource": "PostConfirmation_ConfirmSignUp",
    "request": {
      "userAttributes": {
        "sub": username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        "email_verified": "false",
        "name": name,
        "email": email
      }
    },
    "response": {}
  }

  await handler(event, context)
}

const a_user_signs_up = async (password, name, email) => {
  const cognito = new AWS.CognitoIdentityServiceProvider()
  const userPoolId = process.env.COGNITO_USER_POOL_ID
  const clientId = process.env.USER_POOL_CLIENT_ID

  const signUpResp = await cognito.signUp({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [{
      Name: 'name', 
      Value: name
    }]
  }).promise()

  const username = signUpResp.UserSub;
  console.log(`User ${email} has signed up ${username}`, {
    UserPoolId: userPoolId,
    Username: username
  })
  await cognito.adminConfirmSignUp({
    UserPoolId: userPoolId,
    Username: username
  }).promise()

  console.log(`[${email}] - confirmed sign up`)

  return {
    username,
    name,
    email
  }
}

const we_authenticate_the_user = async (username, password) => {
  const cognito = new AWS.CognitoIdentityServiceProvider()
  const clientId = process.env.USER_POOL_CLIENT_ID

  const auth = await cognito.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSORD: password,
    },
  }).promise();

  return {
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken,
    username,
    email
  }
}

const we_invole_an_appsync_template = (templatePath, context) => { 
  const template = fs.readFileSync(templatePath, { encoding: 'utf-8' })
  const ast = velocityTemplate.parse(template);
  const compiler = new velocityTemplate.Compile(ast, {
    valueMapper: velocityMapper.map,
    escape: false
  });
  const compiled = compiler.render(context)
  return JSON.parse(compiled)
}

const a_user_calls_getMyProfile = async (user) => {
  const queryGetMyProfile = `
    query MyQuery {
      getMyProfile {
        backgroundImageUrl
        bio
        birthdate
        createdAt
        followersCount
        followingCount
        id
        imageUrl
        likesCount
        location
        name
        screenName
        tweetsCount
        website
        tweets {
          nextToken
          tweets {
            createdAt
            id
            liked
            likes
            replies
            retweeted
            retweets
            text
          }
        }
      }
    }`
  console.log(`Querying: ${JSON.srtringify(user)}`)
  const { data: getMyProfile } = await GraphQL(
    process.env.API_URL, 
    queryGetMyProfile, 
    {}, 
    user.accessToken)
  
  return getMyProfile
}

module.exports = {
  we_invoke_confirmUserSignup,
  a_user_signs_up,
  we_invole_an_appsync_template,
  a_user_calls_getMyProfile,
  we_authenticate_the_user
}