import { CustomError } from './custom-error'

export class InternalServerError extends CustomError {
  readonly statusCode = 500

  constructor(error: Error, code = 'UNKNOWN_ERROR') {
    super(error.message, code, { name: error.name, stack: error.stack })
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}
