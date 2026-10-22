import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Post from "../src/models/post.model.js";
import Report from "../src/models/report.model.js";
import User from "../src/models/user.model.js";
import { moderateReport } from "../src/controllers/q15.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q15 moderate report", () => {
  let moderator;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    moderator = await User.create({ email: "mod@example.com", role: "moderator" });
    app = appFor("patch", "/api/reports/:reportId/moderate", (req, res, next) => {
      req.user = { _id: moderator._id, role: "moderator" };
      return moderateReport(req, res, next);
    });
  });

  it("removes the post and resolves the report", async () => {
    const post = await Post.create({ body: "reported", isRemoved: false });
    const report = await Report.create({ post: post._id, reporter: moderator._id, status: "pending" });
    const response = await request(app).patch(`/api/reports/${idOf(report)}/moderate`).send({ action: "remove_post" });
    expect(response.status).toBe(200);
    expect((await Post.findById(post._id)).isRemoved).toBe(true);
    const saved = await Report.findById(report._id);
    expect(saved.status).toBe("resolved");
    expect(String(saved.reviewedBy)).toBe(idOf(moderator));
  });

  it("rejects invalid actions and non-moderators", async () => {
    const post = await Post.create({ body: "reported" });
    const report = await Report.create({ post: post._id, status: "pending" });
    expect((await request(app).patch(`/api/reports/${idOf(report)}/moderate`).send({ action: "nope" })).status).toBe(400);
    const nonMod = await User.create({ email: "user@example.com", role: "user" });
    const blockedApp = appFor("patch", "/api/reports/:reportId/moderate", (req, res, next) => {
      req.user = { _id: nonMod._id, role: "user" };
      return moderateReport(req, res, next);
    });
    expect((await request(blockedApp).patch(`/api/reports/${idOf(report)}/moderate`).send({ action: "dismiss" })).status).toBe(403);
  });
});
