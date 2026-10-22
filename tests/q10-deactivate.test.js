import request from "supertest";
import bcrypt from "bcrypt";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import User from "../src/models/user.model.js";
import { deactivateAccount } from "../src/controllers/q10.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q10 deactivate account", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "account@example.com", password: await bcrypt.hash("secret123", 4), isActive: true });
    app = appFor("post", "/api/account/deactivate", (req, res, next) => {
      req.user = { _id: user._id };
      return deactivateAccount(req, res, next);
    });
  });

  it("deactivates only after both confirmations and clears auth cookie", async () => {
    const response = await request(app).post("/api/account/deactivate").set("Cookie", "token=valid").send({ currentPassword: "secret123", confirmation: "DEACTIVATE" });
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]?.join(";")).toMatch(/token=;/);
    expect((await User.findById(user._id)).isActive).toBe(false);
  });

  it("rejects wrong password and wrong confirmation without deactivating", async () => {
    expect((await request(app).post("/api/account/deactivate").send({ currentPassword: "bad", confirmation: "DEACTIVATE" })).status).toBe(401);
    expect((await request(app).post("/api/account/deactivate").send({ currentPassword: "secret123", confirmation: "DELETE" })).status).toBe(400);
    expect((await User.findById(user._id)).isActive).toBe(true);
  });
});
