import { CustomError } from './custom-error'

class CustomErrorImpl extends CustomError {
  readonly statusCode = 418

  constructor() {
    super('any-error', 'any-code', 'any-data')
  }
}

const makeSut = () => {
  const sut = new CustomErrorImpl()
  return { sut }
}

describe('CustomError', () => {
  it('sets the error message', () => {
    const { sut } = makeSut()
    expect(sut.message).toBe('any-error')
  })

  it('serializes the error information', () => {
    const { sut } = makeSut()
    const data = sut.serialize()
    expect(data).toEqual({
      error: 'any-error',
      code: 'any-code',
      data: 'any-data'
    })
  })
})
