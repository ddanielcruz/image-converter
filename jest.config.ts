/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { Config } from 'jest'

export default {
  preset: 'ts-jest',
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx,js,jsx}',
    '!packages/tests/**',
    '!packages/**/src/index.ts',
    '!packages/shared/src/**/index.ts'
  ],
  coveragePathIgnorePatterns: ['jest.config.ts', '/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@image-converter/(.*)$': '<rootDir>/packages/$1/'
  },
  globalSetup: '<rootDir>/tests/setup.ts',
  globalTeardown: '<rootDir>/tests/teardown.ts'
} as Config
