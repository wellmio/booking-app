# Tasks: Web App for Massage Chair Booking

**Input**: Design documents from `/specs/001-build-a-web/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- Paths shown below are based on the Next.js App Router structure decided in `plan.md`.

## Phase 3.1: Setup

- [ ] T001 Initialize a new Next.js project with `create-next-app` in the repository root.
- [ ] T002 Install project dependencies: `@supabase/supabase-js`, `@stripe/stripe-js`, `@stripe/react-stripe-js`, `resend`, `@upstash/redis`, `@sentry/nextjs`, `@playwright/test`, `jest`.
- [ ] T003 [P] Configure ESLint and Prettier for code quality by creating `.eslintrc.json` and `.prettierrc.json`.
- [ ] T004 [P] Set up Supabase project and define database schema in `supabase/migrations/0001_initial_schema.sql`.
- [ ] T005 [P] Configure Stripe account and add API keys to `.env.local`.
- [ ] T006 [P] Configure Resend account and add API key to `.env.local`.
- [ ] T007 [P] Configure Upstash Redis and add connection details to `.env.local`.
- [ ] T008 [P] Configure Sentry project and add DSN to `.env.local`.

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T009 [P] Create contract test for `GET /api/timeslots` in `tests/contract/timeslots.test.ts`.
- [ ] T010 [P] Create contract test for `POST /api/bookings` in `tests/contract/bookings.test.ts`.
- [ ] T011 [P] Create contract test for `GET /api/admin/booking-options` in `tests/contract/admin.test.ts`.
- [ ] T012 [P] Create contract test for `PUT /api/admin/booking-options` in `tests/contract/admin.test.ts`.
- [ ] T013 [P] Create integration test for the User Booking Flow in `tests/integration/booking.test.ts` based on `quickstart.md`.
- [ ] T014 [P] Create integration test for the Admin Management Flow in `tests/integration/admin.test.ts` based on `quickstart.md`.

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T015 [P] Create database models for `User`, `Appointment`, `TimeSlot`, `Admin`, `BookingOption` in `lib/db/schema.ts` based on `data-model.md`.
- [ ] T016 Implement `GET /api/timeslots` endpoint in `app/(api)/timeslots/route.ts`.
- [ ] T017 Implement `POST /api/bookings` endpoint in `app/(api)/bookings/route.ts`.
- [ ] T018 Implement `GET /api/admin/booking-options` endpoint in `app/(api)/admin/booking-options/route.ts`.
- [ ] T019 Implement `PUT /api/admin/booking-options` endpoint in `app/(api)/admin/booking-options/route.ts`.
- [ ] T020 Create frontend page for user booking at `app/(app)/(user)/book/page.tsx`.
- [ ] T021 Create frontend page for booking confirmation at `app/(app)/(user)/book/confirmation/page.tsx`.
- [ ] T022 Create frontend page for admin login at `app/(app)/(admin)/login/page.tsx`.
- [ ] T023 Create frontend page for admin booking options at `app/(app)/(admin)/options/page.tsx`.

## Phase 3.4: Integration

- [ ] T024 Integrate Supabase Auth for admin login in `app/(app)/(admin)/login/page.tsx`.
- [ ] T025 Integrate Stripe Payment Element into the booking page `app/(app)/(user)/book/page.tsx`.
- [ ] T026 Integrate Resend for sending confirmation emails in the `POST /api/bookings` endpoint.
- [ ] T027 Integrate Sentry for error and performance monitoring in `next.config.js` and throughout the app.
- [ ] T028 Implement caching for `GET /api/timeslots` with Upstash Redis.

## Phase 3.5: Polish

- [ ] T029 [P] Write unit tests for utility functions with Jest in `tests/unit/`.
- [ ] T030 [P] Write unit tests for React components with Jest in `tests/unit/`.
- [ ] T031 Run performance tests with Playwright and optimize to meet performance goals.
- [ ] T032 [P] Update `README.md` with setup and usage instructions.
- [ ] T033 Manually test both user and admin flows to ensure a good user experience.

## Dependencies

- Setup (T001-T008) must be completed before all other phases.
- Tests (T009-T014) must be completed before Core Implementation (T015-T023).
- Core Implementation (T015-T023) must be completed before Integration (T024-T028).
- Integration (T024-T028) must be completed before Polish (T029-T033).

## Parallel Example

```
# The following setup tasks can be run in parallel:
Task: "T003 [P] Configure ESLint and Prettier for code quality by creating .eslintrc.json and .prettierrc.json."
Task: "T004 [P] Set up Supabase project and define database schema in supabase/migrations/0001_initial_schema.sql."
Task: "T005 [P] Configure Stripe account and add API keys to .env.local."
Task: "T006 [P] Configure Resend account and add API key to .env.local."
Task: "T007 [P] Configure Upstash Redis and add connection details to .env.local."
Task: "T008 [P] Configure Sentry project and add DSN to .env.local."

# The following test tasks can be run in parallel:
Task: "T009 [P] Create contract test for GET /api/timeslots in tests/contract/timeslots.test.ts."
Task: "T010 [P] Create contract test for POST /api/bookings in tests/contract/bookings.test.ts."
Task: "T011 [P] Create contract test for GET /api/admin/booking-options in tests/contract/admin.test.ts."
Task: "T012 [P] Create contract test for PUT /api/admin/booking-options in tests/contract/admin.test.ts."
Task: "T013 [P] Create integration test for the User Booking Flow in tests/integration/booking.test.ts based on quickstart.md."
Task: "T014 [P] Create integration test for the Admin Management Flow in tests/integration/admin.test.ts based on quickstart.md."
```
