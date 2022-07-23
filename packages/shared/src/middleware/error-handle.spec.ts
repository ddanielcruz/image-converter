import express from 'express'
import request from 'supertest'

import { InternalServerError } from '../errors/internal-server-error'
import { NotFoundError } from '../errors/not-found-error'
import { errorHandler } from './error-handler'

const makeSut = (error: Error) => {
  const sut = express()
  sut.get('/', () => {
    throw error
  })
  sut.use(errorHandler)

  return { sut }
}

describe('errorHandler', () => {
  it('serializes custom error', async () => {
    const error = new NotFoundError('any-error')
    const { sut } = makeSut(error)
    const response = await request(sut).get('/')
    expect(response.body).toEqual(error.serialize())
  })

  it('sets custom error status code', async () => {
    const error = new NotFoundError('any-error')
    const { sut } = makeSut(error)
    const response = await request(sut).get('/')
    expect(response.statusCode).toEqual(error.statusCode)
  })

  it('throws an internal server error on unknown error', async () => {
    const error = new Error('any-error')
    const { sut } = makeSut(error)
    const response = await request(sut).get('/')
    expect(response.statusCode).toEqual(500)
    expect(response.body).toEqual(new InternalServerError(error).serialize())
  })
})
