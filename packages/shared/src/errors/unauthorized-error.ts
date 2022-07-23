import { CustomError } from './custom-error'

export class UnauthorizedError extends CustomError {
  readonly statusCode = 401

  constructor(message: string, data?: any) {
    super(message, 'UNAUTHORIZED', data)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
