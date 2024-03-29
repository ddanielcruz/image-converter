import { ConnectionStates } from 'mongoose'

import { mongoose } from '@image-converter/tests'

import * as sut from './mongoose'

describe('Mongoose', () => {
  describe('connect', () => {
    afterEach(async () => {
      await mongoose.disconnect()
    })

    it('connects to the database', async () => {
      const connection = await sut.connect()
      expect(connection.connection.readyState).toBe(ConnectionStates.connected)
    })

    it('throws if MONGO_URI is not set', async () => {
      const uri = process.env.MONGO_URI!
      delete process.env.MONGO_URI
      const promise = sut.connect()
      await expect(promise).rejects.toThrowError('MONGO_URI not found')
      process.env.MONGO_URI = uri
    })
  })
})
