import { ConsumerRunConfig } from 'kafkajs'

import { IWebhookCreatedEvent } from './events/webhooks'
import { IListener } from './listener'
import { Topics } from './topics'

const makeKafka = () => {
  class ConsumerStub {
    config: ConsumerRunConfig

    connect = jest.fn()
    subscribe = jest.fn()
    run = jest.fn().mockImplementation((config: ConsumerRunConfig) => {
      this.config = config
    })
  }
  const consumerStub = new ConsumerStub()
  const kafkaStub = { consumer: jest.fn().mockReturnValue(consumerStub) }

  return { consumerStub, kafkaStub }
}

const makeSut = () => {
  class ListenerStub extends IListener<IWebhookCreatedEvent> {
    readonly topic = Topics.WebhookCreated
    readonly group = 'any-group'
    onMessage = jest.fn()
  }
  const { kafkaStub, consumerStub } = makeKafka()
  const sut = new ListenerStub(kafkaStub as any)

  return { sut, kafkaStub, consumerStub }
}

describe('Listener', () => {
  it("creates a consumer with listener's group", async () => {
    const { sut, kafkaStub } = makeSut()
    await sut.listen()
    expect(kafkaStub.consumer).toHaveBeenCalledWith({ groupId: sut.group })
  })

  it("connects consumer and subscribes to listener's topic", async () => {
    const { sut, consumerStub } = makeSut()
    await sut.listen()
    expect(consumerStub.connect).toHaveBeenCalled()
    expect(consumerStub.subscribe).toHaveBeenCalledWith({ topic: sut.topic, fromBeginning: true })
  })

  it('subscribes with fromBeginning to false', async () => {
    const { sut, consumerStub } = makeSut()
    await sut.listen(false)
    expect(consumerStub.subscribe).toHaveBeenCalledWith({ topic: sut.topic, fromBeginning: false })
  })

  it('sets a message handler', async () => {
    const { sut, consumerStub } = makeSut()
    await sut.listen()
    expect(consumerStub.run).toHaveBeenCalledWith({ eachMessage: expect.any(Function) })
  })

  it('invokes handler on message receiver', async () => {
    const { sut, consumerStub } = makeSut()
    const data = { message: 'any-message' }
    const message = { value: Buffer.from(JSON.stringify(data)) }
    await sut.listen()
    await consumerStub.config.eachMessage!({ message } as any)
    expect(sut.onMessage).toHaveBeenCalledWith(data)
  })

  it('invokes handler with null on empty message', async () => {
    const { sut, consumerStub } = makeSut()
    const message = { value: null }
    await sut.listen()
    await consumerStub.config.eachMessage!({ message } as any)
    expect(sut.onMessage).toHaveBeenCalledWith(null)
  })
})
