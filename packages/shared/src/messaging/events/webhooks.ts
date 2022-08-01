import { Topics } from '../topics'

interface IWebhook {
  id: string
}

export interface IWebhookCreatedEvent {
  subject: Topics.WebhookCreated
  data: IWebhook
}

export interface IWebhookUpdatedEvent {
  subject: Topics.WebhookUpdated
  data: IWebhook
}

export interface IWebhookDeletedEvent {
  subject: Topics.WebhookDeleted
  data: {
    id: string
  }
}
