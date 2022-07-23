import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '@image-converter/shared'
import { mongoose } from '@image-converter/tests'

import { User } from '../../database/models'
import { AuthenticateUser } from './authenticate-user'

jwt.sign = jest.fn().mockReturnValue('any-token')

const makeSut = async () => {
  const secret = 'any-secret'
  const sut = new AuthenticateUser(secret)
  const user = await User.create({ email: 'any@email.com' })

  return { sut, secret, user }
}

describe('AuthenticateUser', () => {
  beforeAll(() => {
    return mongoose.connect('authenticate-user')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it('throw when user is not found', async () => {
    const { sut } = await makeSut()
    const promise = sut.execute('invalid-email')
    await expect(promise).rejects.toThrow(UnauthorizedError)
  })

  it('creates a session using jwt', async () => {
    const { sut, user, secret } = await makeSut()
    const token = await sut.execute(user.email)
    expect(token).toBe('any-token')
    expect(jwt.sign).toHaveBeenCalledWith({ id: user._id.toString() }, secret, { expiresIn: '1d' })
  })
})
