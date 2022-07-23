import { Types } from 'mongoose'

import { mongoose } from '@image-converter/tests'

import { User } from '../../database/models'
import { FindUser } from './find-user'

const makeSut = async () => {
  const sut = new FindUser()
  const user = await User.create({ email: 'daniel@example.com' })

  return { sut, user }
}

describe('FindUser', () => {
  beforeAll(() => {
    return mongoose.connect('find-user')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it('returns null when ID is invalid', async () => {
    const { sut } = await makeSut()
    const foundUser = await sut.execute('invalid-id')
    expect(foundUser).toBeFalsy()
  })

  it('returns null when user is not found', async () => {
    const { sut } = await makeSut()
    const foundUser = await sut.execute(new Types.ObjectId().toHexString())
    expect(foundUser).toBeFalsy()
  })

  it('returns user when found', async () => {
    const { sut, user } = await makeSut()
    const foundUser = await sut.execute(user._id)
    expect(foundUser).toBeTruthy()
  })
})
