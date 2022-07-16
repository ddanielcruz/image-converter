export = async function globalTeardown() {
  const instance = global.__MONGO
  await instance.stop()
}
