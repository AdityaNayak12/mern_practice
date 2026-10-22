import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Post from "../src/models/post.model.js";
import Report from "../src/models/report.model.js";
import User from "../src/models/user.model.js";
import { reportPost } from "../src/controllers/q14.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q14 report post", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "reporter@example.com" });
    app = appFor("post", "/api/posts/:postId/report", (req, res, next) => {
      req.user = { _id: user._id };
      return reportPost(req, res, next);
    });
  });

  it("creates one valid report and rejects a duplicate", async () => {
    const post = await Post.create({ body: "bad post" });
    const body = { reason: "spam", details: "Unwanted links" };
    expect((await request(app).post(`/api/posts/${idOf(post)}/report`).send(body)).status).toBe(201);
    expect((await request(app).post(`/api/posts/${idOf(post)}/report`).send(body)).status).toBe(409);
    expect(await Report.countDocuments({ post: post._id, reportedBy: user._id })).toBe(1);
  });

  it("rejects invalid reasons", async () => {
    const post = await Post.create({ body: "post" });
    expect((await request(app).post(`/api/posts/${idOf(post)}/report`).send({ reason: "invalid" })).status).toBe(400);
  });
});
