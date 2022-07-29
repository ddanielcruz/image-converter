import { Types } from 'mongoose'

import { ValidationError } from '@image-converter/shared'
import { mongoose } from '@image-converter/tests'

import { IAuthentication, Webhook } from '../../models'
import { CreateWebhook, ICreateWebhookData } from './create-webhook'

const basicAuth: IAuthentication = { method: 'basic', credentials: 'any:credentials' }
const bearerAuth: IAuthentication = { method: 'bearer', credentials: 'any-token' }

const makeSut = () => {
  const sut = new CreateWebhook()
  const data: ICreateWebhookData = {
    user: new Types.ObjectId().toHexString(),
    url: 'https://webhook.com'
  }

  return { sut, data, basicAuth, bearerAuth }
}

describe('CreateWebhook', () => {
  beforeAll(() => {
    return mongoose.connect('create-webhook')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it.each([
    { url: 'invalid-url' },
    { url: undefined },
    { user: 'invalid-user' },
    { user: undefined },
    { authentication: {} as any },
    { authentication: { method: 'any-method' } as any },
    { authentication: { credentials: 'any-credentials' } as any }
  ])('throws when data is invalid: %o', async (other: Partial<ICreateWebhookData>) => {
    const { sut, data } = makeSut()
    const promise = sut.execute({ ...data, ...other })
    await expect(promise).rejects.toThrow(ValidationError)
  })

  it.each([undefined, basicAuth, bearerAuth])(
    'creates a new webhook with auth: %o',
    async (authentication?: IAuthentication) => {
      const { sut, data } = makeSut()
      const webhook = await sut.execute({ ...data, authentication })
      const webhooks = await Webhook.find().lean()
      expect(webhook).toBeTruthy()
      expect(webhooks.length).toBe(1)
      expect(webhooks[0]).toMatchObject({
        url: data.url,
        user: new Types.ObjectId(data.user),
        enabled: false
      })
      expect(webhooks[0].authentication).toEqual(authentication)
    }
  )

  it.todo('emits a webhook.created event')
})
