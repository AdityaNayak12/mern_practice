import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import mongoose from "mongoose";
import Order from "../src/models/order.model.js";
import User from "../src/models/user.model.js";
import { updateDeliveryAddress } from "../src/controllers/q03.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q03 update delivery address", () => {
  let user;
  let other;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    [user, other] = await User.create([
      { email: "owner@example.com" }, { email: "other@example.com" }
    ]);
    app = appFor("patch", "/api/orders/:orderId/address", (req, res, next) => {
      req.user = { _id: user._id };
      return updateDeliveryAddress(req, res, next);
    });
  });

  it("updates an owned pending order with the whitelisted address", async () => {
    const order = await Order.create({ user: user._id, status: "pending", deliveryAddress: { city: "Old" } });
    const response = await request(app).patch(`/api/orders/${idOf(order)}/address`).send({
      address: { line1: "1 Main Street", city: "Bengaluru", pincode: "560001" }, status: "shipped"
    });
    expect(response.status).toBe(200);
    const saved = await Order.findById(order._id).lean();
    expect(saved.deliveryAddress.city).toBe("Bengaluru");
    expect(saved.status).toBe("pending");
  });

  it("rejects invalid id, missing order, other owners, and non-pending orders", async () => {
    expect((await request(app).patch("/api/orders/nope/address").send({ address: { city: "X" } })).status).toBe(400);
    expect((await request(app).patch(`/api/orders/${new mongoose.Types.ObjectId()}/address`).send({ address: { city: "X" } })).status).toBe(404);
    const otherOrder = await Order.create({ user: other._id, status: "pending" });
    expect((await request(app).patch(`/api/orders/${idOf(otherOrder)}/address`).send({ address: { city: "X" } })).status).toBe(403);
    const shipped = await Order.create({ user: user._id, status: "shipped" });
    expect((await request(app).patch(`/api/orders/${idOf(shipped)}/address`).send({ address: { city: "X" } })).status).toBe(400);
  });
});
