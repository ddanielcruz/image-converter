import { Types } from 'mongoose'

import { BadRequestError } from '@image-converter/shared'
import { mongoose } from '@image-converter/tests'

import { Webhook } from '../../models'
import { ListWebhooks } from './list-webhooks'

const makeSut = async () => {
  const sut = new ListWebhooks()
  const user = new Types.ObjectId().toHexString()
  const webhook = await Webhook.create({ url: 'any-url', user })

  return { sut, user, webhook }
}

describe('ListWebhooks', () => {
  beforeAll(() => {
    return mongoose.connect('list-webhooks')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it('lists webhooks from an user', async () => {
    const { sut, user, webhook } = await makeSut()
    const webhooks = await sut.execute(user)
    expect(webhooks.length).toBe(1)
    expect(webhooks[0].toJSON()).toEqual(webhook.toJSON())
  })

  it('returns an empty list when no webhook is found', async () => {
    const { sut } = await makeSut()
    const webhooks = await sut.execute(new Types.ObjectId().toHexString())
    expect(webhooks.length).toBe(0)
  })

  it('throws a BadRequestError when user is not a valid ObjectId', async () => {
    const { sut } = await makeSut()
    const promise = sut.execute('invalid-user')
    await expect(promise).rejects.toThrow(BadRequestError)
  })
})
