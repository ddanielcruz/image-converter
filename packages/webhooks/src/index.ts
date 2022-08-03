import 'dotenv/config'
import { mongoose as database } from '@image-converter/shared'

import { api } from './api'

async function bootstrap() {
  // TODO: Check Kafka variables
  for (const key of ['JWT_KEY', 'MONGO_URI']) {
    if (!process.env[key]) {
      throw new Error(`${key} must be defined `)
    }
  }

  await database.connect()

  const { PORT = '3000' } = process.env
  api.listen(PORT, () => console.log(`Webhooks service is running on port ${PORT}`))
}

bootstrap()
