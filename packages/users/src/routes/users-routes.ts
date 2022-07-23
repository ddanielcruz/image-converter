import { Router } from 'express'

import { auth } from '@image-converter/shared'

import { AuthenticateUser } from '../services/users/authenticate-user'
import { CreateUser } from '../services/users/create-user'
import { FindUser } from '../services/users/find-user'

export const routes = Router()

routes.get('/me', auth, async (request, response) => {
  const service = new FindUser()
  const user = await service.execute(request.session!.id)

  return response.json(user)
})

routes.post('/', async (request, response) => {
  const service = new CreateUser()
  const user = await service.execute(request.body)

  return response.status(201).json(user)
})

routes.post('/authenticate', async ({ body = {} }, response) => {
  const secret = process.env.JWT_KEY!
  const service = new AuthenticateUser(secret)
  const token = await service.execute(body.email?.toString() || '')

  return response.json({ token })
})
