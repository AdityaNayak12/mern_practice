import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Course from "../src/models/course.model.js";
import User from "../src/models/user.model.js";
import { toggleEnrollment } from "../src/controllers/q04.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q04 toggle enrollment", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "student@example.com", enrolledCourses: [] });
    app = appFor("post", "/api/courses/:courseId/enrollment", (req, res, next) => {
      req.user = { _id: user._id };
      return toggleEnrollment(req, res, next);
    });
  });

  it("enrolls and then withdraws while keeping both documents in sync", async () => {
    const course = await Course.create({ title: "Node", capacity: 2, students: [] });
    const first = await request(app).post(`/api/courses/${idOf(course)}/enrollment`);
    expect(first.status).toBe(200);
    expect(first.body.enrolled).toBe(true);
    let [savedCourse, savedUser] = await Promise.all([Course.findById(course._id), User.findById(user._id)]);
    expect(savedCourse.students.map(idOf)).toContain(idOf(user));
    expect(savedUser.enrolledCourses.map(idOf)).toContain(idOf(course));
    const second = await request(app).post(`/api/courses/${idOf(course)}/enrollment`);
    expect(second.status).toBe(200);
    expect(second.body.enrolled).toBe(false);
    [savedCourse, savedUser] = await Promise.all([Course.findById(course._id), User.findById(user._id)]);
    expect(savedCourse.students).toHaveLength(0);
    expect(savedUser.enrolledCourses).toHaveLength(0);
  });

  it("rejects full courses and invalid ids", async () => {
    const full = await Course.create({ title: "Full", capacity: 1, students: [new User()._id] });
    expect((await request(app).post(`/api/courses/${idOf(full)}/enrollment`)).status).toBe(400);
    expect((await request(app).post("/api/courses/nope/enrollment")).status).toBe(400);
  });
});
