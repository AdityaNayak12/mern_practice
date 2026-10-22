import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Expense from "../src/models/expense.model.js";
import User from "../src/models/user.model.js";
import { createExpense } from "../src/controllers/q01.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q01 create expense", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ name: "Asha", email: "asha@example.com" });
    app = appFor("post", "/api/expenses", (req, res, next) => {
      req.user = { _id: user._id };
      return createExpense(req, res, next);
    });
  });

  it("creates a trimmed, server-owned expense", async () => {
    const response = await request(app).post("/api/expenses").send({
      title: "  Dinner ", amount: 850, category: "food", paymentMethod: "upi",
      owner: new User()._id.toString()
    });
    expect(response.status).toBe(201);
    expect(response.body.expense.owner).toBe(idOf(user));
    expect(await Expense.countDocuments({ owner: user._id, title: "Dinner" })).toBe(1);
  });

  it.each([
    [{ title: "   ", amount: 1, category: "food", paymentMethod: "cash" }],
    [{ title: "Lunch", amount: 0, category: "food", paymentMethod: "cash" }],
    [{ title: "Lunch", amount: "500", category: "food", paymentMethod: "cash" }],
    [{ title: "Lunch", amount: 1, category: "invalid", paymentMethod: "cash" }],
    [{ title: "Lunch", amount: 1, category: "food", paymentMethod: "bitcoin" }]
  ])("rejects invalid expense input %#", async (body) => {
    const response = await request(app).post("/api/expenses").send(body);
    expect(response.status).toBe(400);
  });
});
