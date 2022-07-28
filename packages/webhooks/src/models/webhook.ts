import { Types, Schema, Document, model } from 'mongoose'

interface IAuthentication {
  method: 'basic' | 'bearer'
  credentials: string
}

export interface IWebhookDoc extends Document {
  user: Types.ObjectId
  url: string
  authentication?: IAuthentication
  enabled: boolean
}

const AuthenticationSchema = new Schema(
  {
    method: {
      type: String,
      required: true,
      enum: ['basic', 'bearer']
    },
    credentials: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false,
    versionKey: false
  }
)

const WebhookSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    authentication: {
      type: AuthenticationSchema
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false
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
WebhookSchema.set('versionKey', 'version')

export const Webhook = model<IWebhookDoc>('Webhook', WebhookSchema)
