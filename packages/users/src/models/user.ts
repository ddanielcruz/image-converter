import { Schema, Document, model } from 'mongoose'

export interface IUserDoc extends Document {
  email: string
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = doc._id
        delete ret._id
      }
    }
  }
)
UserSchema.set('versionKey', 'version')

export const User = model<IUserDoc>('User', UserSchema)
