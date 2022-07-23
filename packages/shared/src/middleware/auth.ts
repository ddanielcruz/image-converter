import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../errors/unauthorized-error'

export interface ISession {
  id: string
}

declare global {
  namespace Express {
    interface Request {
      session?: ISession
    }
  }
}

export const auth = (request: Request, _response: Response, next: NextFunction) => {
  const [, token] = (request.headers.authorization?.toString() || '').split(' ')
  if (!token) {
    throw new UnauthorizedError('Token not found.')
  }

  try {
    request.session = jwt.verify(token, process.env.JWT_KEY!) as ISession
    return next()
  } catch (error) {
    throw new UnauthorizedError('Invalid token.')
  }
}
