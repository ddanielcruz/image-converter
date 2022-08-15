import Joi from 'joi'

import { FieldError, ValidationError } from './validation-error'

describe('ValidationError', () => {
  const makeSut = () => {
    const errorsStub = [new FieldError('any-field', 'any-message')]
    const sut = new ValidationError(errorsStub)
    return { sut, errorsStub }
  }

  it('has status code 400', () => {
    const { sut } = makeSut()
    expect(sut.statusCode).toBe(400)
  })

  it('sets data as received errors', () => {
    const { sut, errorsStub } = makeSut()
    expect(sut.data).toBe(errorsStub)
  })
})

describe('FieldError', () => {
  describe('generate', () => {
    const validator = Joi.object().keys({ email: Joi.string().email() })

    it('generates errors from a validation result', () => {
      const { error } = validator.validate({ email: 'invalid-email' })
      const errors = FieldError.generate(error)
      expect(errors.length).toBe(1)
      expect(errors[0]).toEqual({ field: 'email', message: expect.any(String) })
    })

    it('sets error label as unknown when it does not have a context', () => {
      const { error } = validator.validate({ email: 'invalid-email' })
      error!.details[0].context = undefined
      const errors = FieldError.generate(error)
      expect(errors[0].field).toBe('unknown')
    })

    it('returns empty list on empty validation result', () => {
      const { error } = validator.validate({ email: 'daniel@example.com' })
      const errors = FieldError.generate(error)
      expect(errors.length).toBe(0)
    })
  })

  describe('includes', () => {
    const properties = ['prop-a', 'prop-b']

    it('returns true if errors list has the property', async () => {
      const errors = [
        new FieldError(properties[0], 'any-message'),
        new FieldError('other-prop', 'other-message')
      ]
      expect(FieldError.includes(errors, properties[0])).toBe(true)
    })

    it('returns true if errors list has any of the properties', () => {
      const errors = [
        new FieldError(properties[0], 'any-message'),
        new FieldError(properties[1], 'other-message'),
        new FieldError('another-prop', 'another-message')
      ]
      expect(FieldError.includes(errors, ...properties)).toBe(true)
    })

    it('returns false if errors list does not have any of the properties', () => {
      const errors = [new FieldError('any-prop', 'any-message')]
      expect(FieldError.includes(errors, properties[0])).toBe(false)
    })
  })
})
