import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Transaction from "../src/models/transaction.model.js";
import User from "../src/models/user.model.js";
import { getTransactions } from "../src/controllers/q08.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q08 transaction search", () => {
  let user;
  let other;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    [user, other] = await User.create([{ email: "finance@example.com" }, { email: "other@example.com" }]);
    await Transaction.insertMany([
      { user: user._id, title: "Salary", amount: 5000, type: "credit", category: "work", createdAt: new Date("2026-01-01") },
      { user: user._id, title: "Rent", amount: 2000, type: "debit", category: "home", createdAt: new Date("2026-02-01") },
      { user: user._id, title: "Food", amount: 500, type: "debit", category: "food", createdAt: new Date("2026-03-01") },
      { user: other._id, title: "Secret", amount: 99999, type: "credit", category: "other", createdAt: new Date("2026-03-02") }
    ]);
    app = appFor("get", "/api/transactions", (req, res, next) => {
      req.user = { _id: user._id };
      return getTransactions(req, res, next);
    });
  });

  it("filters to the current user and paginates sorted results", async () => {
    const response = await request(app).get("/api/transactions").query({ type: "debit", minAmount: 500, sort: "amount_desc", page: 1, limit: 1 });
    expect(response.status).toBe(200);
    expect(response.body.transactions).toHaveLength(1);
    expect(response.body.transactions[0].title).toBe("Rent");
    expect(response.body.pagination.total).toBe(2);
    expect(response.body.pagination.limit).toBe(1);
  });

  it.each([
    { minAmount: "nope" },
    { from: "nope" },
    { sort: "random" }
  ])("rejects invalid query %#", async (query) => {
    expect((await request(app).get("/api/transactions").query(query)).status).toBe(400);
  });
});
