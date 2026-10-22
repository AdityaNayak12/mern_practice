import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Product from "../src/models/product.model.js";
import Review from "../src/models/review.model.js";
import User from "../src/models/user.model.js";
import { createOrUpdateReview } from "../src/controllers/q09.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q09 product review", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "reviewer@example.com" });
    app = appFor("put", "/api/products/:productId/review", (req, res, next) => {
      req.user = { _id: user._id };
      return createOrUpdateReview(req, res, next);
    });
  });

  it("creates once, then updates the same user/product review", async () => {
    const product = await Product.create({ name: "Keyboard" });
    const first = await request(app).put(`/api/products/${idOf(product)}/review`).send({ rating: 4, comment: "Good" });
    expect(first.status).toBe(201);
    const second = await request(app).put(`/api/products/${idOf(product)}/review`).send({ rating: 5, comment: "Excellent" });
    expect(second.status).toBe(200);
    expect(await Review.countDocuments({ product: product._id, user: user._id })).toBe(1);
    expect((await Review.findOne({ product: product._id, user: user._id })).rating).toBe(5);
  });

  it("rejects non-integer ratings outside 1..5", async () => {
    const product = await Product.create({ name: "Mouse" });
    for (const rating of [0, 6, 4.5]) {
      expect((await request(app).put(`/api/products/${idOf(product)}/review`).send({ rating, comment: "x" })).status).toBe(400);
    }
  });
});
