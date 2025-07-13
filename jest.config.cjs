// Load .env variables for Jest
require('dotenv').config();

module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/jest/**/*.test.{js,jsx,ts,tsx}'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest/setupTests.ts'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': 'identity-obj-proxy',
    '^@/config/environment$': '<rootDir>/src/config/environment.node.ts',
    '^@/config/environment\\.ts$': '<rootDir>/src/config/environment.node.ts',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  testTimeout: 10000,
  maxWorkers: 1,
  clearMocks: true,
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
        VITE_AUTH_TOKEN: process.env.VITE_AUTH_TOKEN
      }
    }
  }
};
