import { ConnectionStates } from 'mongoose'

import { mongoose } from '@image-converter/tests'

import * as database from './index'

describe('Database', () => {
  describe('connect', () => {
    afterEach(async () => {
      await mongoose.disconnect()
    })

    it('connects to the database', async () => {
      const connection = await database.connect()
      expect(connection.connection.readyState).toBe(ConnectionStates.connected)
    })

    it('throws if MONGO_URI is not set', async () => {
      const uri = process.env.MONGO_URI!
      delete process.env.MONGO_URI
      const promise = database.connect()
      await expect(promise).rejects.toThrowError('MONGO_URI not found')
      process.env.MONGO_URI = uri
    })
  })
})
