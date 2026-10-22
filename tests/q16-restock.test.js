import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import InventoryLog from "../src/models/inventoryLog.model.js";
import Product from "../src/models/product.model.js";
import User from "../src/models/user.model.js";
import { restockProduct } from "../src/controllers/q16.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q16 restock inventory", () => {
  let employee;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    employee = await User.create({ email: "warehouse@example.com", role: "warehouse" });
    app = appFor("post", "/api/inventory/:productId/restock", (req, res, next) => {
      req.user = { _id: employee._id, role: "warehouse" };
      return restockProduct(req, res, next);
    });
  });

  it("increments stock and creates an inventory log", async () => {
    const product = await Product.create({ name: "Cable", stock: 100 });
    const response = await request(app).post(`/api/inventory/${idOf(product)}/restock`).send({ quantity: 25 });
    expect(response.status).toBe(200);
    expect((await Product.findById(product._id)).stock).toBe(125);
    expect(await InventoryLog.countDocuments({ product: product._id, quantity: 25, performedBy: employee._id })).toBe(1);
  });

  it("rejects invalid quantity and unauthorized roles", async () => {
    const product = await Product.create({ name: "Cable", stock: 100 });
    expect((await request(app).post(`/api/inventory/${idOf(product)}/restock`).send({ quantity: 0 })).status).toBe(400);
    const user = await User.create({ email: "user@example.com", role: "user" });
    const blocked = appFor("post", "/api/inventory/:productId/restock", (req, res, next) => {
      req.user = { _id: user._id, role: "user" };
      return restockProduct(req, res, next);
    });
    expect((await request(blocked).post(`/api/inventory/${idOf(product)}/restock`).send({ quantity: 1 })).status).toBe(403);
  });
});
