// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Set up test environment variables
process.env.TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
process.env.TEST_ADMIN_TOKEN = process.env.TEST_ADMIN_TOKEN || 'mock-admin-token'

// Mock fetch for tests that don't have a real server
global.fetch = global.fetch || require('node-fetch')