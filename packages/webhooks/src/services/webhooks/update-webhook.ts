import Joi from 'joi'
import { isObjectIdOrHexString } from 'mongoose'

import { FieldError, NotFoundError, ValidationError } from '@image-converter/shared'

import { WebhookUpdatedPublisher } from '../../messaging/publishers/webhook-updated-publisher'
import { IAuthentication, Webhook } from '../../models'

export interface IUpdateWebhookData {
  url: string
  authentication?: IAuthentication
}

const validator = Joi.object<IUpdateWebhookData>().keys({
  url: Joi.string().trim().empty('').uri().required(),
  authentication: Joi.object<IAuthentication>().keys({
    method: Joi.string().trim().empty('').lowercase().valid('basic', 'bearer').required(),
    credentials: Joi.string().trim().empty('').required()
  })
})

export class UpdateWebhook {
  constructor(private readonly publisher: WebhookUpdatedPublisher) {}

  async execute(userId: string, webhookId: string, data: IUpdateWebhookData): Promise<void> {
    // Finds webhook by ID and throws if not found or not owned by used
    const webhook = isObjectIdOrHexString(webhookId) ? await Webhook.findById(webhookId) : null
    if (!webhook || webhook.user.toString() !== userId) {
      throw new NotFoundError('Webhook not found.')
    }

    // Validate and sanitize received data
    const { error, value } = validator.validate(data)
    const errors = FieldError.generate(error)

    if (errors.length) {
      throw new ValidationError(errors)
    }

    // Update webhook and emits webhook updated event
    await webhook.set(value).save()
    await this.publisher.publish(webhook.toJSON())
  }
}
