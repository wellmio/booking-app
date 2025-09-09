# Implementation Plan: Web App for Massage Chair Booking

**Branch**: `001-build-a-web` | **Date**: 2025-09-09 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-build-a-web/spec.md`

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
4. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
5. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, or `GEMINI.md` for Gemini CLI).
6. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
7. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
8. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

The feature is a web application for Wellmio that allows users to book and pay for massage chair appointments. It includes an admin interface for managing booking options. The technical approach is a serverless web app using Next.js on Vercel, with Supabase for the database and authentication, Stripe for payments, and other managed services for email, caching, and monitoring.

## Technical Context

**Language/Version**: Next.js (TypeScript/React)
**Primary Dependencies**:

- Frontend + Serverless API: Next.js on Vercel
- Database + Auth: Supabase (Postgres)
- Payments: Stripe
- Email/SMS & notifications: Postmark or Resend (email), Sinch or Twilio (SMS)
- Caching/queues/rate-limits: Upstash Redis
- Monitoring: Sentry, Vercel Analytics/Logs
- Strong ID (optional): BankID via broker (e.g., Signicat, Scrive, ZignSec)
  **Storage**: Supabase (Postgres) in an EU region
  **Testing**: [NEEDS CLARIFICATION: Recommend Playwright for E2E/integration and Jest for unit tests]
  **Target Platform**: Web, deployed on Vercel
  **Project Type**: Web Application (Frontend + Serverless API)
  **Performance Goals**: [NEEDS CLARIFICATION: Recommend targeting >90 Lighthouse score for Performance, Accessibility, Best Practices, SEO. p95 API response time < 300ms]
  **Constraints**:
- All data processing and storage must be in an EU region.
- Avoid logging Personally Identifiable Information (PII).
  **Scale/Scope**: [NEEDS CLARIFICATION: Initial target of 1,000 users and 100 daily bookings]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Simplicity**:

- Projects: [1] (Next.js app) - Compliant
- Using framework directly? Yes - Compliant
- Single data model? Yes - Compliant
- Avoiding patterns? Yes, starting simple - Compliant

**Architecture**:

- EVERY feature as library? No, this is a web application. This principle is more for CLI tools. Not applicable.
- Libraries listed: N/A
- CLI per library: N/A
- Library docs: N/A

**Testing (NON-NEGOTIABLE)**:

- RED-GREEN-Refactor cycle enforced? Yes, will be enforced.
- Git commits show tests before implementation? Yes, will be enforced.
- Order: Contract→Integration→E2E→Unit strictly followed? Yes, will be enforced.
- Real dependencies used? Yes, will use real DBs in testing environments.
- Integration tests for: new libraries, contract changes, shared schemas? Yes.

**Observability**:

- Structured logging included? Yes, via Sentry and Vercel Logs.
- Frontend logs → backend? Yes, will be configured.
- Error context sufficient? Yes, will be configured.

**Versioning**:

- Version number assigned? Yes, will use semantic versioning (e.g., 0.1.0).
- BUILD increments on every change? No, will increment MINOR for new features and PATCH for fixes.
- Breaking changes handled? Yes, will be handled via versioning.

## Project Structure

### Documentation (this feature)

```
specs/001-build-a-web/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
app/
  ├── (api)/              # Serverless functions (route handlers)
  ├── (app)/              # Frontend pages
  │   ├── (admin)/
  │   └── (user)/
  ├── components/
  ├── lib/
  └── services/
tests/
  ├── contract/
  ├── integration/
  └── unit/
```

**Structure Decision**: A modern Next.js App Router structure will be used.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - Research and decide on a testing framework: Playwright vs. Jest.
   - Define and confirm performance goals (Lighthouse, p95 latency).
   - Confirm initial scale and scope assumptions.
   - Research BankID integration and decide if it's needed for v1.

2. **Generate and dispatch research agents**:
   - Research best practices for Next.js with Supabase Auth and RLS.
   - Research Stripe Payment Element integration in a Next.js app.
   - Research best practices for structured logging with Sentry in Next.js.

3. **Consolidate findings** in `research.md`.

**Output**: `research.md` with all NEEDS CLARIFICATION resolved.

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`.
2. **Generate API contracts** from functional requirements → `/contracts/`.
3. **Generate contract tests** from contracts.
4. **Extract test scenarios** from user stories → `quickstart.md`.
5. **Update agent file** with tech stack details.

**Output**: `data-model.md`, `/contracts/*`, failing tests, `quickstart.md`, agent-specific file.

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Generate tasks from Phase 1 design docs.
- Each API endpoint in `/contracts` will have a corresponding task to implement the endpoint and its tests.
- Each entity in `data-model.md` will have a task for creating the database schema and model code.
- User stories from `quickstart.md` will be broken down into frontend component and page creation tasks.

**Ordering Strategy**:

- TDD order: Tests before implementation.
- Dependency order: Backend (API, DB) before Frontend.

**Estimated Output**: ~30 tasks in `tasks.md`.

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md)
**Phase 5**: Validation (run tests, execute quickstart.md)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
