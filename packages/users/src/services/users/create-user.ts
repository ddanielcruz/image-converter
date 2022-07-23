import Joi from 'joi'

import { FieldError } from '@image-converter/shared'

import { User } from '../../database/models'

export interface ICreateUserData {
  email: string
}

const validator = Joi.object<ICreateUserData>().keys({
  email: Joi.string().trim().lowercase().email().required()
})

export class CreateUser {
  async execute(data: ICreateUserData) {
    const { error } = validator.validate(data)
    const errors = FieldError.generate(error)

    if (!FieldError.includes(errors, 'email')) {
      const anotherUser = await User.findOne({ email: data.email })
      if (anotherUser) {
        errors.push(new FieldError('email', 'Email is already taken.'))
      }
    }

    if (errors.length) {
      FieldError.throw(errors)
    }

    return await User.create({ email: data.email })
  }
}
