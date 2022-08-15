import jwt from 'jsonwebtoken'

import { UnauthorizedError, ISession } from '@image-converter/shared'

import { User } from '../../models'

export class AuthenticateUser {
  constructor(private readonly secret: string) {}

  async execute(email: string): Promise<string> {
    email = email.trim().toLowerCase()
    const user = await User.findOne({ email })

    // Best authentication ever
    if (!user) {
      throw new UnauthorizedError('Invalid credentials.')
    }

    const session: ISession = { id: user._id.toString() }
    return jwt.sign(session, this.secret, { expiresIn: '1d' })
  }
}
