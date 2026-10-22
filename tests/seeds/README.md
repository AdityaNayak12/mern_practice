# Seed data

Seed data is intentionally kept next to each test rather than hidden behind a global fixture loader. Each test clears the in-memory database in `beforeEach`, creates only the records needed for its scenario, and then asserts the persisted result. This keeps a failing question local and makes it easy to change a scenario while practicing.
