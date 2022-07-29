import Joi from 'joi'
import { isObjectIdOrHexString } from 'mongoose'

import { FieldError } from '@image-converter/shared'

import { IAuthentication, IWebhookDoc, Webhook } from '../../models'

export interface ICreateWebhookData {
  user: string
  url: string
  authentication?: IAuthentication
}

const validator = Joi.object<ICreateWebhookData>().keys({
  user: Joi.string().trim().required(),
  url: Joi.string().trim().uri().required(),
  authentication: Joi.object<IAuthentication>().keys({
    method: Joi.string().trim().lowercase().valid('basic', 'bearer').required(),
    credentials: Joi.string().trim().required()
  })
})

export class CreateWebhook {
  async execute(data: ICreateWebhookData): Promise<IWebhookDoc> {
    const { error, value } = validator.validate(data)
    const errors = FieldError.generate(error)

    if (!FieldError.includes(errors, 'user') && !isObjectIdOrHexString(value!.user)) {
      errors.push(new FieldError('user', 'Invalid user ID.'))
    }

    if (errors.length) {
      FieldError.throw(errors)
    }

    // TODO: Emit event about webhook creation
    return await Webhook.create({
      user: value!.user,
      url: value!.url,
      authentication: value!.authentication
    })
  }
}
