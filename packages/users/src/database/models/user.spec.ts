import { mongoose } from '@image-converter/tests'

import { User } from './user'

describe('User', () => {
  beforeAll(() => {
    return mongoose.connect('user')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it('deletes _id property and sets id for normalization', async () => {
    const user = await User.create({ email: 'any@email.com' })
    expect(user.toJSON()).toEqual({
      id: user._id,
      email: 'any@email.com',
      version: 0
    })
  })
})
