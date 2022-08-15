import { Router } from 'express'

export const routes = Router()

routes.get('/', async (_request, response) => {
  // TODO: Inject service
  return response.status(204).send()
})

routes.post('/', async (_request, response) => {
  // TODO: Inject publisher and service
  return response.status(204).send()
})
