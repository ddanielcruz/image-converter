export interface ISerializedError<T = any> {
  error: string
  code: string
  data?: T
}

export abstract class CustomError<T = any> extends Error {
  abstract readonly statusCode: number

  constructor(message: string, readonly code: string, readonly data?: T) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  serialize(): ISerializedError {
    return {
      error: this.message,
      code: this.code,
      data: this.data
    }
  }
}
