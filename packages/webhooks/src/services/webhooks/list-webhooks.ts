import { isObjectIdOrHexString } from 'mongoose'

import { BadRequestError } from '@image-converter/shared'

import { IWebhookDoc, Webhook } from '../../models'

export class ListWebhooks {
  async execute(user: string): Promise<IWebhookDoc[]> {
    if (!isObjectIdOrHexString(user)) {
      throw new BadRequestError('Invalid user ID.', 'INVALID_ID')
    }

    return await Webhook.find({ user })
  }
}
