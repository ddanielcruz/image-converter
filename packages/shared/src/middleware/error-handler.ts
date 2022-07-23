/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../errors/custom-error'
import { InternalServerError } from '../errors/internal-server-error'

export const errorHandler = async (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof CustomError) {
    return response.status(error.statusCode).send(error.serialize())
  }

  return response.status(500).send(new InternalServerError(error).serialize())
}
