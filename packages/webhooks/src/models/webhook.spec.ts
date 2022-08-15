import { Types } from 'mongoose'

import { mongoose } from '@image-converter/tests'

import { Webhook } from './webhook'

describe('Webhook', () => {
  beforeAll(() => {
    return mongoose.connect('webhook')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it('deletes _id property and sets id for normalization', async () => {
    const webhook = await Webhook.create({
      user: new Types.ObjectId(),
      url: 'any-url',
      authentication: {
        method: 'basic',
        credentials: 'any-user:any-pass'
      },
      enabled: true
    })
    expect(webhook.toJSON()).toEqual({
      id: webhook._id,
      user: webhook.user,
      url: 'any-url',
      authentication: {
        method: 'basic',
        credentials: 'any-user:any-pass'
      },
      enabled: true,
      version: 0
    })
  })
})
