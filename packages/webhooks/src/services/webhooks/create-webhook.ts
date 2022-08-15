import Joi from 'joi'
import { isObjectIdOrHexString } from 'mongoose'

import { FieldError, ValidationError } from '@image-converter/shared'

import { WebhookCreatedPublisher } from '../../messaging/publishers/webhook-created-publisher'
import { IAuthentication, IWebhookDoc, Webhook } from '../../models'

export interface ICreateWebhookData {
  user: string
  url: string
  authentication?: IAuthentication
}

const validator = Joi.object<ICreateWebhookData>().keys({
  user: Joi.string().trim().empty('').required(),
  url: Joi.string().trim().empty('').uri().required(),
  authentication: Joi.object<IAuthentication>().keys({
    method: Joi.string().trim().empty('').lowercase().valid('basic', 'bearer').required(),
    credentials: Joi.string().trim().empty('').required()
  })
})

export class CreateWebhook {
  constructor(private readonly publisher: WebhookCreatedPublisher) {}

  async execute(data: ICreateWebhookData): Promise<IWebhookDoc> {
    const { error, value } = validator.validate(data)
    const errors = FieldError.generate(error)

    if (!FieldError.includes(errors, 'user') && !isObjectIdOrHexString(value!.user)) {
      errors.push(new FieldError('user', 'Invalid user ID.'))
    }

    if (errors.length) {
      throw new ValidationError(errors)
    }

    const webhook = await Webhook.create({
      user: value!.user,
      url: value!.url,
      authentication: value!.authentication
    })
    await this.publisher.publish(webhook.toJSON())

    return webhook
  }
}
