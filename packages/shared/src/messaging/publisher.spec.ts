import { IWebhookDeletedEvent } from './events/webhooks'
import { IPublisher } from './publisher'
import { Topics } from './topics'

const makeSut = () => {
  class PublisherStub extends IPublisher<IWebhookDeletedEvent> {
    readonly topic = Topics.WebhookDeleted
  }
  const producerStub = { send: jest.fn(), connect: jest.fn() }
  const kafkaStub = { producer: jest.fn().mockReturnValue(producerStub) }
  const sut = new PublisherStub(kafkaStub as any)

  return { sut, kafkaStub, producerStub }
}

describe('Publisher', () => {
  it('creates a producer on creation', async () => {
    const { kafkaStub } = makeSut()
    expect(kafkaStub.producer).toHaveBeenCalled()
  })

  it('connects the producer', async () => {
    const { sut, producerStub } = makeSut()
    await sut.connect()
    expect(producerStub.connect).toHaveBeenCalled()
  })

  it('publishes data with topic to producer', async () => {
    const { sut, producerStub } = makeSut()
    const data: IWebhookDeletedEvent['data'] = { id: 'any-id' }
    await sut.publish(data)
    expect(producerStub.send).toHaveBeenCalledWith({
      topic: sut.topic,
      messages: [{ value: JSON.stringify(data), partition: undefined }]
    })
  })

  it('sets data partition', async () => {
    const { sut, producerStub } = makeSut()
    const data: IWebhookDeletedEvent['data'] = { id: 'any-id' }
    await sut.publish(data, 1)
    expect(producerStub.send).toHaveBeenCalledWith({
      topic: sut.topic,
      messages: [{ value: JSON.stringify(data), partition: 1 }]
    })
  })
})
