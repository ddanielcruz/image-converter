import mongoose from 'mongoose'

export async function connect() {
  // TODO: Customize URL on testing environment
  const { MONGO_URL } = process.env
  if (!MONGO_URL) {
    throw new Error('MONGO_URL not found')
  }

  await mongoose.connect(MONGO_URL)
}
