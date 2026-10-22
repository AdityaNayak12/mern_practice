import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Notification from "../src/models/notification.model.js";
import User from "../src/models/user.model.js";
import { markAllNotificationsRead } from "../src/controllers/q19.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q19 mark notifications read", () => {
  let user;
  let other;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    [user, other] = await User.create([{ email: "one@example.com" }, { email: "two@example.com" }]);
    await Notification.insertMany([
      { user: user._id, message: "one", isRead: false },
      { user: user._id, message: "already", isRead: true },
      { user: other._id, message: "other", isRead: false }
    ]);
    app = appFor("patch", "/api/notifications/read-all", (req, res, next) => {
      req.user = { _id: user._id };
      return markAllNotificationsRead(req, res, next);
    });
  });

  it("updates only current-user unread notifications and returns the count", async () => {
    const response = await request(app).patch("/api/notifications/read-all");
    expect(response.status).toBe(200);
    expect(response.body.updatedCount).toBe(1);
    expect(await Notification.countDocuments({ user: user._id, isRead: false })).toBe(0);
    expect(await Notification.countDocuments({ user: other._id, isRead: false })).toBe(1);
  });
});
