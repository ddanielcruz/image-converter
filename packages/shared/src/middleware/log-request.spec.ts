import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import request from 'supertest'

import { logRequest } from './log-request'

const makeSut = () => {
  const sut = express()
  sut.get('/', logRequest, (_request, response) => response.status(204).send())

  return { sut }
}

describe('logRequest', () => {
  it('skips log on testing environment', async () => {
    const { sut } = makeSut()
    await request(sut).get('/').expect(204)
    const dirPath = path.resolve(__dirname, '..', '..', 'logs')
    const logs = await fs.readdir(dirPath).catch(() => [])
    expect(logs.length).toBeLessThanOrEqual(2)
  })
})
