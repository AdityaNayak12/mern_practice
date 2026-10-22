import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Project from "../src/models/project.model.js";
import Task from "../src/models/task.model.js";
import User from "../src/models/user.model.js";
import { updateTaskStatus } from "../src/controllers/q18.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q18 task workflow", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "member@example.com" });
    app = appFor("patch", "/api/tasks/:taskId/status", (req, res, next) => {
      req.user = { _id: user._id };
      return updateTaskStatus(req, res, next);
    });
  });

  it("allows a member through an allowed transition", async () => {
    const project = await Project.create({ name: "Project", members: [user._id] });
    const task = await Task.create({ title: "Ship", project: project._id, status: "todo" });
    const response = await request(app).patch(`/api/tasks/${idOf(task)}/status`).send({ status: "in_progress" });
    expect(response.status).toBe(200);
    expect((await Task.findById(task._id)).status).toBe("in_progress");
  });

  it("rejects random jumps and non-members", async () => {
    const project = await Project.create({ name: "Project", members: [] });
    const task = await Task.create({ title: "Ship", project: project._id, status: "todo" });
    expect((await request(app).patch(`/api/tasks/${idOf(task)}/status`).send({ status: "done" })).status).toBe(403);
    await Project.updateOne({ _id: project._id }, { members: [user._id] });
    expect((await request(app).patch(`/api/tasks/${idOf(task)}/status`).send({ status: "done" })).status).toBe(400);
  });
});
