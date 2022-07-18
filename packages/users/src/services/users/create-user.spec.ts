import { mongoose } from '@image-converter/tests'

describe('CreateUser', () => {
  beforeAll(() => {
    return mongoose.connect('create-user')
  })

  beforeEach(() => {
    return mongoose.reset()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  it('should do something', async () => {
    //
  })
})
