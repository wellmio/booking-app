# Test Suite for Wellmio Booking App

This directory contains the test suite for the Wellmio booking application, following Test-Driven Development (TDD) principles.

## Test Structure

```
tests/
├── contract/          # API contract tests (T009-T012)
├── integration/       # End-to-end flow tests (T013-T014)
├── unit/             # Unit tests for components and utilities
└── README.md         # This file
```

## Test Categories

### Contract Tests (T009-T012)

These tests verify that API endpoints conform to their OpenAPI specifications:

- **T009**: `GET /api/timeslots` - Tests time slot retrieval
- **T010**: `POST /api/bookings` - Tests booking creation
- **T011**: `GET /api/admin/booking-options` - Tests admin option retrieval
- **T012**: `PUT /api/admin/booking-options` - Tests admin option updates

### Integration Tests (T013-T014)

These tests verify complete user flows:

- **T013**: User Booking Flow - Complete booking process from time slot selection to confirmation
- **T014**: Admin Management Flow - Complete admin workflow from login to option management

## Running Tests

### Prerequisites

1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.template`)

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test categories
npm run test:contract      # Contract tests only
npm run test:integration   # Integration tests only
npm run test:unit         # Unit tests only
```

### Environment Variables

For integration tests, set these environment variables:

```bash
TEST_BASE_URL=http://localhost:3000
TEST_ADMIN_TOKEN=your-admin-token-here
```

## Test Philosophy

### TDD Approach

These tests are designed to **FAIL** initially, following the Red-Green-Refactor cycle:

1. **Red**: Write failing tests (current state)
2. **Green**: Implement minimal code to make tests pass
3. **Refactor**: Improve code while keeping tests green

### Test Requirements

- All tests must be written before implementation
- Tests must fail initially (proving they work)
- Tests must be comprehensive and cover edge cases
- Tests must use real dependencies where possible

## Expected Test Results

### Current State (Phase 3.2)

All tests should **FAIL** because the endpoints are not yet implemented. This is expected and correct for TDD.

### After Implementation (Phase 3.3+)

Tests should pass once the corresponding endpoints are implemented.

## Test Data

Tests use mock data and should be isolated from each other. Each test cleans up after itself to avoid side effects.

## Debugging Tests

To debug failing tests:

1. Check the test output for specific error messages
2. Verify environment variables are set correctly
3. Ensure the development server is running (for integration tests)
4. Check that all dependencies are installed

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Include comprehensive test cases (happy path, edge cases, error conditions)
3. Add appropriate documentation
4. Ensure tests are isolated and don't depend on each other
5. Update this README if adding new test categories
