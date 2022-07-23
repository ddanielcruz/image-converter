import { Router } from 'express'

import { routes as users } from './users-routes'

export const routes = Router()

routes.use('/users', users)
