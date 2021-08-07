
const when = require('./when');
const chance = require('chance').Chance()
const velocityUtil = require('amplify-appsync-simulator/lib/velocity/util')


const a_random_user = () => {
  const firstName = chance.first({ nationality: 'en' })
  const lastName = chance.last({ nationality: 'en' })
  const suffix = chance.string({ length: 4, pool: 'abcdefghijklmnopqrstuvwxyz' })
  const name = `${firstName} ${lastName} ${suffix}`
  const password = "ASDFasdf1234!@#$"
  const email = `${firstName}.${lastName}.${suffix}@mnesis.com`

  return {
    name, 
    password,
    email,
  }
}

const an_appsync_context = (identity, args) => {
  const util = velocityUtil.create([], new Date(), Object())
  const context = {
    identity,
    args,
    arguments: args,
  }

  return {
    context,
    ctx: context,
    util,
    utils: util
  }
}

const an_authenticated_user = () => {
  const { name, email, password } = a_random_user()

  const { username } = when.a_user_signs_up(password, name, email);

  const { accessToken, idToken } = when.we_authenticate_the_user(username, password)

  return {
    username,
    name,
    email,
    password,
    accessToken,
    idToken
  }
} 

module.exports = {
  a_random_user,
  an_appsync_context,
  an_authenticated_user
}