# MERN Backend Practice Harness Design

## Goal

Create a runnable practice repository for the 20 controllers in the three linked MERN backend sheets. A student fills the controller/middleware files under `src/`, runs one question or the whole suite, and receives failures tied to the requirements and expected state changes.

## Design

- Node ESM with Vitest as the runner.
- Mongoose models mirror the models named by the sheets.
- `mongodb-memory-server` supplies an isolated MongoDB for each test file, so tests exercise real queries, updates, ObjectIds, dates, and persistence without a local MongoDB installation.
- Each test mounts the student handler in a tiny Express app and asserts HTTP status, response shape, and database state.
- `src/controllers/` and `src/middleware/` contain editable entry points with the same named exports as the supplied stubs. They intentionally throw a clear “not implemented” error until the student fills them.
- `tests/seeds/` contains deterministic seed helpers. Tests use current-time-relative dates where the requirement is relative to “now”.

## Scope

Included: package setup, shared test database lifecycle, model schemas, 20 editable student entry points, 20 focused test files, seed fixtures, and README instructions.

Not included: a production Express server, authentication issuance/login, frontend code, migrations, solution implementations, or a local MongoDB service.

## Compatibility contract

The student files must preserve the exported names from the sheets:

| Question | Export | Main models/behavior |
|---|---|---|
| 1 | `createExpense` | validation + server-owned expense |
| 2 | `searchProperties` | optional filters + sorting |
| 3 | `updateDeliveryAddress` | owner + pending order |
| 4 | `toggleEnrollment` | course/user relationship |
| 5 | `authenticate`, `getPremiumArticle` | JWT cookie + premium access |
| 6 | `rescheduleAppointment` | future date + conflict |
| 7 | `borrowBook` | inventory + user limit |
| 8 | `getTransactions` | filters + pagination |
| 9 | `createOrUpdateReview` | upsert-like review behavior |
| 10 | `deactivateAccount` | password + cookie clearing |
| 11 | `cancelReservation` | reservation + room update |
| 12 | `submitAssignment` | create/resubmit before deadline |
| 13 | `respondToInvitation` | invited-user state transition |
| 14 | `reportPost` | duplicate report prevention |
| 15 | `moderateReport` | role + report/post transition |
| 16 | `restockProduct` | role + `$inc` + audit log |
| 17 | `applyCoupon` | cart total + coupon rules |
| 18 | `updateTaskStatus` | member + allowed workflow transition |
| 19 | `markAllNotificationsRead` | scoped `updateMany` behavior |
| 20 | `addAddress` | five-address/default invariant |

## Failure behavior

If a student file is still untouched, its handler returns HTTP 501 with a readable error, so the test report points at the unfinished behavior. Once the student replaces the placeholder with the supplied stub, the tests execute normally and report the first unmet requirement. Tests are independently runnable with `npm test -- q01`, etc.

