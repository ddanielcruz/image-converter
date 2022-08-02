import { Topics } from '../topics'

export interface IWebhookData {
  id: string
}

export interface IWebhookCreatedEvent {
  topic: Topics.WebhookCreated
  data: IWebhookData
}

export interface IWebhookUpdatedEvent {
  topic: Topics.WebhookUpdated
  data: IWebhookData
}

export interface IWebhookDeletedEvent {
  topic: Topics.WebhookDeleted
  data: {
    id: string
  }
}
