import { IPublisher, IWebhookUpdatedEvent, Topics } from '@image-converter/shared'

export class WebhookUpdatedPublisher extends IPublisher<IWebhookUpdatedEvent> {
  readonly topic = Topics.WebhookUpdated
}
