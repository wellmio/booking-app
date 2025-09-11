const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.test.tsx'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    'stripe': '<rootDir>/tests/__mocks__/stripe.ts',
  },
  testTimeout: 30000, // 30 seconds timeout for integration tests
  automock: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);