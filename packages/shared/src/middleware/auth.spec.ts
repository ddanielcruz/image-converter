import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'

import { auth } from './auth'

process.env.JWT_KEY = 'any-secret'

const makeSut = () => {
  const token = jwt.sign({ id: 'any-id' }, 'any-secret')
  const sut = express()
  sut.get('/', auth, (_request, response) => response.status(204).send())

  return { sut, token }
}

describe('auth', () => {
  it('throws when token is not found', async () => {
    const { sut } = makeSut()
    await request(sut).get('/').expect(401)
  })

  it('throws when token is invalid', async () => {
    const { sut } = makeSut()
    await request(sut).get('/').set('Authorization', 'invalid-token').expect(401)
  })

  it('throws when token is expired', async () => {
    const { sut } = makeSut()
    const token = jwt.sign({ id: 'any-id' }, 'any-secret', { expiresIn: '1ms' })
    await new Promise(resolve => setTimeout(resolve, 10))
    await request(sut).get('/').set('Authorization', `Bearer ${token}`).expect(401)
  })

  it('throws when secret is invalid', async () => {
    const { sut } = makeSut()
    const token = jwt.sign({ id: 'any-id' }, 'other-secret')
    await request(sut).get('/').set('Authorization', `Bearer ${token}`).expect(401)
  })

  it('sets session and returns 204 on success', async () => {
    const { sut, token } = makeSut()
    await request(sut).get('/').set('Authorization', `Bearer ${token}`).expect(204)
  })
})
