import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import User from "../src/models/user.model.js";
import { addAddress } from "../src/controllers/q20.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

const address = (n, makeDefault = false) => ({ label: `Place ${n}`, line1: `${n} Main Street`, city: "Bengaluru", pincode: `56000${n}`, makeDefault });

describe("Q20 saved addresses", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "addresses@example.com", addresses: [] });
    app = appFor("post", "/api/account/addresses", (req, res, next) => {
      req.user = { _id: user._id };
      return addAddress(req, res, next);
    });
  });

  it("makes the first address default and replaces the default when requested", async () => {
    expect((await request(app).post("/api/account/addresses").send(address(1))).status).toBe(201);
    expect((await User.findById(user._id)).addresses[0].isDefault).toBe(true);
    expect((await request(app).post("/api/account/addresses").send(address(2, true))).status).toBe(201);
    const saved = await User.findById(user._id);
    expect(saved.addresses.filter(item => item.isDefault)).toHaveLength(1);
    expect(saved.addresses.find(item => item.label === "Place 2").isDefault).toBe(true);
  });

  it("rejects incomplete input and a sixth address", async () => {
    expect((await request(app).post("/api/account/addresses").send({ label: "Only label" })).status).toBe(400);
    await User.updateOne({ _id: user._id }, { addresses: Array.from({ length: 5 }, (_, i) => ({ ...address(i + 1), isDefault: i === 0 })) });
    expect((await request(app).post("/api/account/addresses").send(address(6))).status).toBe(400);
    expect(idOf(user)).toBeTruthy();
  });
});
