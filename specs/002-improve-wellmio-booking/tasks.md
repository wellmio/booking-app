# Tasks: Improve Wellmio Booking Experience

**Input**: Design documents from `/specs/002-improve-wellmio-booking/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Phase 3.1: Setup

- [x] T001: Install `shadcn/ui` and its dependencies by running `npx shadcn-ui@latest init` and following the prompts.

## Phase 3.2: Database

- [x] T002: Create a new migration file in `supabase/migrations/` for the `timeslots` and `bookings` tables.
- [x] T003: Define the schema for the `timeslots` and `bookings` tables in the new migration file, based on `data-model.md`.

## Phase 3.3: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.4

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T004: [P] Create contract test for `GET /api/timeslots` in `tests/contract/timeslots.test.ts`.
- [x] T005: [P] Create contract test for `POST /api/bookings` in `tests/contract/bookings.test.ts`.
- [x] T006: [P] Create contract test for `GET /api/admin/bookings` in `tests/contract/admin.test.ts`.
- [x] T007: [P] Create contract test for `POST /api/admin/timeslots` in `tests/contract/admin.test.ts`.
- [x] T008: [P] Create contract test for `PUT /api/admin/timeslots/{id}` in `tests/contract/admin.test.ts`.
- [x] T009: [P] Create contract test for `DELETE /api/admin/timeslots/{id}` in `tests/contract/admin.test.ts`.
- [x] T010: [P] Create contract test for `POST /api/stripe/webhook`.
- [x] T011: [P] Create integration test for the user booking flow in `tests/integration/booking.test.ts`.
- [x] T012: [P] Create integration test for the admin timeslot management flow in `tests/integration/admin.test.ts`.

## Phase 3.4: Core Implementation (ONLY after tests are failing)

- [x] T013: [P] Create/update the `TimeSlot` and `Booking` types in `src/lib/db/schema.ts` based on `data-model.md`.
- [x] T014: Implement the `GET /api/timeslots/route.ts` endpoint.
- [x] T015: Implement the `POST /api/bookings/route.ts` endpoint.
- [x] T016: Implement the `GET /api/admin/bookings/route.ts` endpoint for bookings.
- [x] T017: Implement the `POST /api/admin/timeslots/route.ts` endpoint for timeslots.
- [x] T018: Implement the `PUT /api/admin/timeslots/{id}/route.ts` endpoint for timeslots.
- [x] T019: Implement the `DELETE /api/admin/timeslots/{id}/route.ts` endpoint for timeslots.
- [x] T020: Implement the `POST /api/stripe/webhook/route.ts` endpoint.

## Phase 3.5: Frontend

- [ ] T021: Create the calendar component using `shadcn/ui` in `src/app/(app)/(user)/book/page.tsx`.
- [ ] T022: Implement the logic to fetch and display available timeslots on the booking page.
- [ ] T023: Implement the booking form and the call to the `POST /api/bookings` endpoint.
- [ ] T024: Implement the redirect to Stripe Checkout.
- [ ] T025: Create the booking confirmation page at `src/app/(app)/(user)/book/confirmation/page.tsx`.
- [ ] T026: Create the admin dashboard page for managing bookings at `src/app/(app)/(admin)/options/page.tsx`.
- [ ] T027: Create the admin dashboard page for managing timeslots, also in `src/app/(app)/(admin)/options/page.tsx`.

## Phase 3.6: Integration

- [ ] T028: Integrate the database queries for timeslots and bookings in the API routes using Supabase client.
- [ ] T029: Secure the admin routes using Supabase auth.

## Phase 3.7: Polish

- [ ] T030: [P] Add unit tests for any new utility functions in `tests/unit/`.
- [ ] T031: [P] Manually test the user and admin flows as described in `quickstart.md`.
- [ ] T032: [P] Review and refactor the code for clarity and performance.

## Dependencies

- T002, T003 must be done before T013.
- Tests (T004-T012) must be written and failing before Core Implementation (T013-T020).
- Core Implementation (T013-T020) should be done before Frontend (T021-T027).

## Parallel Example

```
# Launch T004-T012 together:
Task: "Create contract test for GET /api/timeslots in tests/contract/timeslots.test.ts"
Task: "Create contract test for POST /api/bookings in tests/contract/bookings.test.ts"
Task: "Create integration test for the user booking flow in tests/integration/booking.test.ts"
...
```
