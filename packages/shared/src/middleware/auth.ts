import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '../errors/unauthorized-error'

export interface ISession {
  id: string
}

declare module 'express' {
  interface Request {
    session?: ISession
  }
}

export const auth = (request: Request, _response: Response, next: NextFunction) => {
  const token = request.header('x-access-token')?.toString()
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
