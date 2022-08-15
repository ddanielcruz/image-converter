import { IPublisher, IWebhookCreatedEvent, Topics } from '@image-converter/shared'

export class WebhookCreatedPublisher extends IPublisher<IWebhookCreatedEvent> {
  readonly topic = Topics.WebhookCreated
}
