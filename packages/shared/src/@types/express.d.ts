import { ISession } from '../middleware/auth'

declare global {
  namespace Express {
    interface Request {
      session?: ISession
    }
  }
}
