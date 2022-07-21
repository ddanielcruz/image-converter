import mongoose from 'mongoose'

const { MONGO_URI } = process.env
mongoose.connect(MONGO_URI!).then(() => console.log('Successfully connected to Mongo!'))
