import { Types } from 'mongoose'

import { NotFoundError, ValidationError } from '@image-converter/shared'
import { mongoose } from '@image-converter/tests'

import { WebhookUpdatedPublisher } from '../../messaging/publishers/webhook-updated-publisher'
import { Webhook } from '../../models'
import { IUpdateWebhookData, UpdateWebhook } from './update-webhook'

const makePublisher = (): WebhookUpdatedPublisher => {
  class WebhookUpdatedPublisherStub implements Partial<WebhookUpdatedPublisher> {
    publish = jest.fn()
  }

  return new WebhookUpdatedPublisherStub() as any
}

const makeSut = async () => {
  const publisherStub = makePublisher()
  const sut = new UpdateWebhook(publisherStub)
  const webhook = await Webhook.create({
    user: new Types.ObjectId(),
    url: 'any-url'
  })
  const userId = webhook.user.toHexString()
  const data: IUpdateWebhookData = { url: 'https://webhooks.com' }

  return { sut, publisherStub, webhook, userId, data }
}

describe('UpdateWebhook', () => {
  beforeAll(() => {
    return mongoose.connect('update-webhook')
  })

  beforeEach(mongoose.reset)
  afterAll(mongoose.disconnect)

  it.each([
    { url: 'invalid-url' },
    { url: '' },
    { authentication: { method: '', credentials: 'any-cred' } },
    { authentication: { method: 'invalid-method', credentials: 'any-cred' } },
    { authentication: { method: 'basic', credentials: '' } }
  ])('throws if data is invalid: %o', async other => {
    const { sut, webhook, userId, data } = await makeSut()
    const promise = sut.execute(userId, webhook.id, { ...data, ...other } as any)
    await expect(promise).rejects.toThrow(ValidationError)
  })

  it('throws if webhook is not found', async () => {
    const { sut, userId, data } = await makeSut()
    const promise = sut.execute(userId, new Types.ObjectId().toHexString(), data)
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  it('throws if webhook ID is invalid', async () => {
    const { sut, data, userId } = await makeSut()
    const promise = sut.execute(userId, 'invalid-id', data)
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  it('throws if webhook does not belong to user', async () => {
    const { sut, data, webhook } = await makeSut()
    const promise = sut.execute(new Types.ObjectId().toHexString(), webhook.id, data)
    await expect(promise).rejects.toThrow(NotFoundError)
  })

  it('updates webhook doc', async () => {
    const { sut, userId, webhook, data } = await makeSut()
    await sut.execute(userId, webhook.id, data)
    const updatedDoc = await Webhook.findById(webhook._id)
    expect(updatedDoc).toMatchObject(data)
  })

  it('publishes webhook updated event', async () => {
    const { sut, userId, webhook, data, publisherStub } = await makeSut()
    const publishSpy = jest.spyOn(publisherStub, 'publish')
    await sut.execute(userId, webhook.id, data)
    expect(publishSpy).toHaveBeenCalled()
  })
})
