import { Schema, Document, model } from 'mongoose'

export interface IUserDoc extends Document {
  email: string
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
})

export const User = model<IUserDoc>('User', UserSchema)
