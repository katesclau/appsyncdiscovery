const given = require('../../steps/given');
const when = require('../../steps/when');
const then = require('../../steps/then');
const chance = require('chance').Chance();

describe('Given an authenticated user', () => {
  let user
  beforeAll(async () => {
    user = await given.an_authenticated_user()
  })

  afterAll(async () => {
    await then.remove_user(user.username)
  })

  it('The user can  fetch his profile with getMyProfile', async () => {
    const profile = await when.a_user_calls_getMyProfile(user)
    const { username, name } = user;
    console.log('profile', profile)
    expect(profile).toMatchObject({
      id: username,
      name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      birthdate: null,
      createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g),
      // tweets: TweetsPage!
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0
    })

    
    const [firstName, lastName] = name.split(' ')
    expect(profile.screenName).toContain(firstName)
    expect(profile.screenName).toContain(lastName)
  })
})