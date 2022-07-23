import request from 'supertest'

import { mongoose } from '@image-converter/tests'

import { api } from '../api'
import { User } from '../database/models'

process.env.JWT_KEY = 'any-secret'

describe('/api/users', () => {
  beforeAll(() => {
    return mongoose.connect('users-routes')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  describe('POST /', () => {
    it.each(['invalid-email', ''])('returns 400 on invalid data: %s', async (email: string) => {
      await request(api).post('/api/users').send({ email }).expect(400)
    })

    it('returns 201 on success', async () => {
      const { body } = await request(api)
        .post('/api/users')
        .send({ email: 'daniel@example.com' })
        .expect(201)
      const users = await User.find()
      expect(users.length).toBe(1)
      expect(body).toEqual({ ...users[0].toJSON(), id: users[0]._id.toHexString() })
    })
  })

  describe('POST /authenticate', () => {
    it.each(['wrong-email', ''])(
      'returns 401 on invalid credentials: %s',
      async (email: string) => {
        await request(api).post('/api/users/authenticate').send({ email }).expect(401)
      }
    )

    it('returns 200 with a token on valid credentials', async () => {
      const email = 'daniel@example.com'
      await request(api).post('/api/users').send({ email }).expect(201)
      const { body } = await request(api)
        .post('/api/users/authenticate')
        .send({ email })
        .expect(200)
      expect(body.token).toBeTruthy()
    })
  })

  describe('GET /me', () => {
    it('returns 401 on invalid token', async () => {
      await request(api).get('/api/users/me').expect(401)
    })

    it('returns 200 and user information on valid token', async () => {
      const email = 'daniel@example.com'
      const { body: user } = await request(api).post('/api/users').send({ email }).expect(201)
      const {
        body: { token }
      } = await request(api).post('/api/users/authenticate').send({ email }).expect(200)
      const { body } = await request(api)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      expect(body).toEqual(user)
    })
  })
})
