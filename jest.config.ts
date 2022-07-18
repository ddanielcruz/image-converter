/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import { Config } from 'jest'

// TODO: Add Mongo temporary server setup
export default {
  preset: 'ts-jest',
  clearMocks: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/**/*.{ts,tsx,js,jsx}'],
  coveragePathIgnorePatterns: ['jest.config.ts', '/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@image-converter/(.*)$': '<rootDir>/packages/$1/'
  }
} as Config
