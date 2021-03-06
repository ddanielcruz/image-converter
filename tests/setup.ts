import { MongoMemoryServer } from 'mongodb-memory-server'

declare global {
  // eslint-disable-next-line no-var
  var __MONGO: MongoMemoryServer
}

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create()
  global.__MONGO = instance
  process.env.MONGO_URI = instance.getUri()
}
