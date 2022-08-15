import { ValidationError } from '@image-converter/shared'
import { mongoose } from '@image-converter/tests'

import { User } from '../../models'
import { CreateUser, ICreateUserData } from './create-user'

const makeSut = () => {
  const sut = new CreateUser()
  const data: ICreateUserData = { email: 'daniel@example.com' }

  return { sut, data }
}

describe('CreateUser', () => {
  beforeAll(() => {
    return mongoose.connect('create-user')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it.each(['', 'invalid-email', 'invalid@email'])(
    'should throw an error if email is invalid: %s',
    async email => {
      const { sut } = makeSut()
      const promise = sut.execute({ email })
      await expect(promise).rejects.toThrow(ValidationError)
    }
  )

  it('should throw an error if email is already taken', async () => {
    const { sut, data } = makeSut()
    await User.create(data)
    const promise = sut.execute(data)
    await expect(promise).rejects.toThrow(ValidationError)
  })

  it('should create an user', async () => {
    const { sut, data } = makeSut()
    const user = await sut.execute(data)
    const [foundUser] = await User.find()
    expect(user).toBeTruthy()
    expect(foundUser.email).toBe(data.email)
  })
})
