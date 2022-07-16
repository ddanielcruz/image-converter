import mongoose from 'mongoose'

export async function connect(database: string) {
  const url = `${process.env.MONGO_URL}${database}`
  await mongoose.connect(url)
}

export async function disconnect() {
  await mongoose.disconnect()
}

export async function reset() {
  await mongoose.connection.dropDatabase()
}
