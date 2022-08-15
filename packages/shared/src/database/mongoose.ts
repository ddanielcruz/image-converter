import mongoose from 'mongoose'

export async function connect() {
  const { MONGO_URI } = process.env
  if (!MONGO_URI) {
    throw new Error('MONGO_URI not found')
  }

  return await mongoose.connect(MONGO_URI)
}
