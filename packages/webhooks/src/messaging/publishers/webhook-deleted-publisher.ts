import { IPublisher, IWebhookDeletedEvent, Topics } from '@image-converter/shared'

export class WebhookDeletedPublisher extends IPublisher<IWebhookDeletedEvent> {
  readonly topic = Topics.WebhookDeleted
}
