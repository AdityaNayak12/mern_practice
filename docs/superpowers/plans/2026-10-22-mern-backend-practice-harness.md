# MERN Backend Practice Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable, seeded Vitest/Mongoose practice harness for all 20 MERN backend questions.

**Architecture:** ESM Node project with Mongoose schemas in `src/models`, editable student entry points in `src/controllers` and `src/middleware`, and black-box tests in `tests`. Tests use a shared in-memory MongoDB lifecycle and deterministic per-question seeds.

**Tech Stack:** Node.js ESM, Express, Mongoose, Vitest, Supertest, MongoDB Memory Server, JSON Web Token, bcryptjs.

**Spec:** `docs/superpowers/specs/2026-10-22-mern-backend-practice-harness-design.md`

## Global Constraints

- Preserve the export names and model import paths listed in the spec.
- Keep test assertions focused on observable HTTP responses and persisted state.
- Do not add solution implementations.
- Tests must run without a user-managed MongoDB server.

---

### Task 1: Project and shared test infrastructure

**Files:**
- Create: `package.json`
- Create: `vitest.config.js`
- Create: `tests/support/mongo.js`
- Create: `tests/support/app.js`
- Create: `.gitignore`

- [ ] **Step 1: Add package scripts and dependencies.**
- [ ] **Step 2: Add the in-memory MongoDB lifecycle and Express handler adapter.**
- [ ] **Step 3: Run the empty test command to verify the runner starts.**

### Task 2: Models and editable student entry points

**Files:**
- Create: `src/models/*.model.js`
- Create: `src/controllers/q01.controller.js` through `q04.controller.js`
- Create: `src/middleware/authenticate.js`
- Create: `src/controllers/q05.controller.js` through `q20.controller.js`

- [ ] **Step 1: Add the schemas required by the supplied stubs.**
- [ ] **Step 2: Add placeholder exports with the exact sheet names.**
- [ ] **Step 3: Import every entry point in a smoke test so missing exports fail clearly.**

### Task 3: Seeds and tests for questions 1–5

**Files:**
- Create: `tests/seeds/q01.js` through `q05.js`
- Create: `tests/q01-expense.test.js` through `q05-premium.test.js`

- [ ] **Step 1: Seed the minimum valid and invalid states.**
- [ ] **Step 2: Add red tests for each sheet test case and state invariant.**
- [ ] **Step 3: Run the focused tests and confirm placeholder failures are readable.**

### Task 4: Seeds and tests for questions 6–10

**Files:**
- Create: `tests/seeds/q06.js` through `q10.js`
- Create: `tests/q06-appointment.test.js` through `q10-deactivate.test.js`

- [ ] **Step 1: Seed ownership, status, conflict, pagination, review, and password states.**
- [ ] **Step 2: Add tests for successful and rejected paths.**
- [ ] **Step 3: Run the focused tests and inspect failure output.**

### Task 5: Seeds and tests for questions 11–20

**Files:**
- Create: `tests/seeds/q11.js` through `q20.js`
- Create: `tests/q11-reservation.test.js` through `q20-address.test.js`

- [ ] **Step 1: Seed multi-document, role, coupon, workflow, notification, and address states.**
- [ ] **Step 2: Add tests for success paths, validation, authorization, and invariants.**
- [ ] **Step 3: Run the focused tests and inspect failure output.**

### Task 6: Documentation and full verification

**Files:**
- Create: `README.md`
- Modify: `package.json`

- [ ] **Step 1: Document install, per-question commands, export contract, and seed behavior.**
- [ ] **Step 2: Run the full test suite and verify all 20 test files collect.**
- [ ] **Step 3: Check the final diff and report the placeholder behavior accurately.**

