import { UnauthorizedError } from './unauthorized-error'

const makeSut = () => {
  const sut = new UnauthorizedError('any-message', 'any-data')
  return { sut }
}

describe('UnauthorizedError', () => {
  it('has status code 401', () => {
    const { sut } = makeSut()
    expect(sut.statusCode).toBe(401)
  })

  it('sets received message and data ', async () => {
    const { sut } = makeSut()
    expect(sut.message).toBe('any-message')
    expect(sut.data).toBe('any-data')
  })
})
