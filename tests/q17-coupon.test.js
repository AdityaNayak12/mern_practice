import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Coupon from "../src/models/coupon.model.js";
import Product from "../src/models/product.model.js";
import User from "../src/models/user.model.js";
import { applyCoupon } from "../src/controllers/q17.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q17 apply coupon", () => {
  let user;
  let coupon;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    const product = await Product.create({ name: "Bag", price: 2500 });
    user = await User.create({ email: "buyer@example.com", cart: [{ product: product._id, quantity: 2 }] });
    coupon = await Coupon.create({ code: "SAVE20", discountPercent: 20, minimumCartValue: 1000, expiresAt: new Date(Date.now() + 86_400_000), usageLimit: 10, usedBy: [] });
    app = appFor("post", "/api/cart/apply-coupon", (req, res, next) => {
      req.user = { _id: user._id };
      return applyCoupon(req, res, next);
    });
  });

  it("normalizes the code and returns the pricing breakdown without consuming it", async () => {
    const response = await request(app).post("/api/cart/apply-coupon").send({ code: " save20 " });
    expect(response.status).toBe(200);
    expect(response.body.pricing).toMatchObject({ cartTotal: 5000, discount: 1000, finalAmount: 4000 });
    expect((await Coupon.findById(coupon._id)).usedBy).toHaveLength(0);
  });

  it("rejects missing, expired, already-used, and under-minimum coupons", async () => {
    expect((await request(app).post("/api/cart/apply-coupon").send({ code: "" })).status).toBe(400);
    await Coupon.updateOne({ _id: coupon._id }, { expiresAt: new Date(Date.now() - 1_000) });
    expect((await request(app).post("/api/cart/apply-coupon").send({ code: "SAVE20" })).status).toBe(400);
    await Coupon.updateOne({ _id: coupon._id }, { expiresAt: new Date(Date.now() + 86_400_000), usedBy: [user._id] });
    expect((await request(app).post("/api/cart/apply-coupon").send({ code: "SAVE20" })).status).toBe(400);
    await Coupon.updateOne({ _id: coupon._id }, { usedBy: [], minimumCartValue: 999999 });
    expect((await request(app).post("/api/cart/apply-coupon").send({ code: "SAVE20" })).status).toBe(400);
    expect(idOf(user)).toBeTruthy();
  });
});
