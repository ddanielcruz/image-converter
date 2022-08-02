import { Kafka, Partitioners, Producer } from 'kafkajs'

import { Topics } from './topics'

interface IEvent<T = any> {
  topic: Topics
  data: T
}

export abstract class IPublisher<T extends IEvent> {
  abstract readonly topic: T['topic']
  protected producer: Producer

  constructor(protected readonly kafka: Kafka) {
    this.producer = this.kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner })
  }

  async connect() {
    await this.producer.connect()
  }

  async publish(data: T['data'], partition?: number): Promise<void> {
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(data), partition }]
    })
  }
}
