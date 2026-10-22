# MERN backend practice harness

This repo is a test harness for the 20 questions in the linked practice sheets. It gives you the models, deterministic database state, and failing tests; you implement the controller/middleware code.

## Setup

```bash
npm install
npm test
```

The first run downloads a MongoDB binary for `mongodb-memory-server`. No local MongoDB service is required.

Run one question while working:

```bash
npm test -- q08
npm test -- q15
```

## Where to write code

Fill the sheet-style stubs in:

```text
src/controllers/q01.controller.js ... q20.controller.js
src/middleware/authenticate.js
```

Keep the named exports from the sheets:

```text
createExpense, searchProperties, updateDeliveryAddress,
toggleEnrollment, authenticate, getPremiumArticle,
rescheduleAppointment, borrowBook, getTransactions,
createOrUpdateReview, deactivateAccount, cancelReservation,
submitAssignment, respondToInvitation, reportPost, moderateReport,
restockProduct, applyCoupon, updateTaskStatus,
markAllNotificationsRead, addAddress
```

The tests mount each handler on the route from its question, attach `req.user` where the sheet assumes authentication, and reset the in-memory database before each test. Seed documents live beside the test that uses them so each scenario is easy to edit.

## Test behavior

Each file now includes the necessary imports, named export, and numbered implementation steps from the sheet. The unfinished fallback returns HTTP 501, so `npm test` is expected to fail until you implement the questions. That is intentional. A passing question means its observable requirements and database side effects are covered by the harness.

The tests check behavior rather than internal calls. For example, Q16 verifies the stock and audit log after restocking; it does not require a particular way to call `$inc`. Q19 similarly verifies that only the current user's unread notifications change.

Source requirements: [Questions 1–5](https://github.com/mrinal1224/social_media_B/blob/main/EndTermPractice%281-5%29.md), [Questions 6–10](https://github.com/mrinal1224/social_media_B/blob/main/EndTermPractice%286-10%29.md), and [Questions 11–20](https://github.com/mrinal1224/social_media_B/blob/main/EndTermPractice%2811-20%29.md).
