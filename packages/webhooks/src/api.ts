import express from 'express'
import 'express-async-errors'

import { auth, errorHandler } from '@image-converter/shared'

import { routes } from './routes'

export const api = express()
api.use(express.json())
api.use('/api', auth, routes)
api.use(errorHandler)
