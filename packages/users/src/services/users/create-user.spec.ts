import * as database from '../../tests/database'

describe('CreateUser', () => {
  beforeAll(() => {
    return database.connect('create-user')
  })

  beforeEach(() => {
    return database.reset()
  })

  afterAll(() => {
    return database.disconnect()
  })

  it('should do something', async () => {
    //
  })
})
