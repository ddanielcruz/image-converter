import { Router } from 'express'

import { routes as webhooks } from './webhooks-routes'

export const routes = Router()

routes.use('/webhooks', webhooks)
