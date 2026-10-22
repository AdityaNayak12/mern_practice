import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Assignment from "../src/models/assignment.model.js";
import Submission from "../src/models/submission.model.js";
import User from "../src/models/user.model.js";
import { submitAssignment } from "../src/controllers/q12.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q12 assignment submission", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "student@example.com" });
    app = appFor("put", "/api/assignments/:assignmentId/submission", (req, res, next) => {
      req.user = { _id: user._id };
      return submitAssignment(req, res, next);
    });
  });

  it("creates once and resubmits by updating the same document", async () => {
    const assignment = await Assignment.create({ title: "API", deadline: new Date(Date.now() + 86_400_000) });
    const first = await request(app).put(`/api/assignments/${idOf(assignment)}/submission`).send({ submissionUrl: "https://example.com/v1" });
    expect(first.status).toBe(201);
    const second = await request(app).put(`/api/assignments/${idOf(assignment)}/submission`).send({ submissionUrl: "https://example.com/v2" });
    expect(second.status).toBe(200);
    expect(await Submission.countDocuments({ assignment: assignment._id, student: user._id })).toBe(1);
    expect((await Submission.findOne({ assignment: assignment._id, student: user._id })).submissionUrl).toBe("https://example.com/v2");
  });

  it("rejects missing URL and late submissions", async () => {
    const late = await Assignment.create({ title: "Late", deadline: new Date(Date.now() - 1_000) });
    expect((await request(app).put(`/api/assignments/${idOf(late)}/submission`).send({ submissionUrl: "" })).status).toBe(400);
    expect((await request(app).put(`/api/assignments/${idOf(late)}/submission`).send({ submissionUrl: "https://example.com" })).status).toBe(400);
  });
});
