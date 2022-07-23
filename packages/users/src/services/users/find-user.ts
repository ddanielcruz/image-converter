import { isValidObjectId } from 'mongoose'

import { User, IUserDoc } from '../../database/models'

export class FindUser {
  async execute(id: string): Promise<IUserDoc | null> {
    if (isValidObjectId(id)) {
      return await User.findById(id)
    }

    return null
  }
}
