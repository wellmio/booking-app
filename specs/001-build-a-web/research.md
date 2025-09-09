# Research: Web App for Massage Chair Booking

## Testing Framework for Next.js

- **Decision**: Use Playwright for E2E tests and Jest for unit tests.
- **Rationale**: Playwright provides excellent capabilities for end-to-end testing of web applications, including cross-browser testing. Jest is a widely-used and well-supported framework for unit testing React components and business logic. This combination provides comprehensive test coverage.
- **Alternatives considered**: Cypress (another E2E framework).

## Performance Goals

- **Decision**:
  - Lighthouse scores: >90 for Performance, Accessibility, Best Practices, and SEO.
  - p95 API response time: < 300ms for all critical API endpoints.
- **Rationale**: These are standard industry benchmarks for a high-quality web application and will ensure a good user experience.

## Scale and Scope

- **Decision**:
  - Initial target: 1,000 users.
  - Expected load: 100 daily bookings.
- **Rationale**: This provides a clear target for initial infrastructure setup and load testing. The system should be designed to scale beyond these numbers in the future.

## BankID Integration

- **Decision**: Defer BankID integration for v1.
- **Rationale**: The primary requirement is a simple booking system. BankID adds significant complexity and cost. Standard email/password authentication via Supabase Auth is sufficient for the initial version. This can be revisited in a future iteration if required.

## Best Practices

- **Next.js with Supabase Auth and RLS**: Use the official Supabase helper libraries for Next.js. Implement Row Level Security policies in Supabase to control data access.
- **Stripe Payment Element**: Use the official Stripe React library. The Payment Element allows for a single integration to accept multiple payment methods.
- **Structured Logging with Sentry**: Use the Sentry Next.js SDK. Configure it to capture errors and performance data. Ensure no PII is sent to Sentry.
