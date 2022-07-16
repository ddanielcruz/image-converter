/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { Config } from 'jest'

export default {
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  globalSetup: '<rootDir>/src/tests/setup.ts',
  globalTeardown: '<rootDir>/src/tests/teardown.ts'
} as Config
