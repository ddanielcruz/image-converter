import Joi from 'joi'

import { User } from '../../database/models'

export interface ICreateUserData {
  email: string
}

const validator = Joi.object<ICreateUserData>().keys({
  email: Joi.string().trim().lowercase().email().required()
})

export class CreateUser {
  async execute(data: ICreateUserData) {
    // TODO: Create common errors and error validation helpers
    const { error } = validator.validate(data)
    if (error) {
      throw new Error('Email is not valid!')
    }

    const { email } = data
    const anotherUser = await User.findOne({ email })
    if (anotherUser) {
      throw new Error('Email is already taken!')
    }

    return await User.create({ email })
  }
}
