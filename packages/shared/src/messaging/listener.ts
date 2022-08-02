import { Kafka } from 'kafkajs'

import { Topics } from './topics'

interface IEvent<T = any> {
  topic: Topics
  data: T
}

export abstract class IListener<T extends IEvent> {
  abstract readonly topic: T['topic']
  abstract readonly group: string
  abstract onMessage(data: T['data']): Promise<void>

  constructor(protected readonly kafka: Kafka) {}

  async listen(fromBeginning = true) {
    const consumer = this.kafka.consumer({ groupId: this.group })
    await consumer.connect()
    await consumer.subscribe({ topic: this.topic, fromBeginning })
    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = message.value ? JSON.parse(message.value.toString('utf-8')) : null
        this.onMessage(data)
      }
    })
  }
}
