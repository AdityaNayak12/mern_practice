import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Invitation from "../src/models/invitation.model.js";
import Project from "../src/models/project.model.js";
import User from "../src/models/user.model.js";
import { respondToInvitation } from "../src/controllers/q13.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q13 project invitation", () => {
  let invited;
  let other;
  let project;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    [invited, other] = await User.create([{ email: "invited@example.com" }, { email: "other@example.com" }]);
    project = await Project.create({ name: "Project", members: [] });
    app = appFor("patch", "/api/invitations/:invitationId/respond", (req, res, next) => {
      req.user = { _id: invited._id };
      return respondToInvitation(req, res, next);
    });
  });

  it("accepts only the invited user and adds them once", async () => {
    const invitation = await Invitation.create({ project: project._id, invitedUser: invited._id, status: "pending" });
    const response = await request(app).patch(`/api/invitations/${idOf(invitation)}/respond`).send({ action: "accept" });
    expect(response.status).toBe(200);
    const saved = await Project.findById(project._id);
    expect(saved.members.map(String)).toContain(idOf(invited));
    expect((await Invitation.findById(invitation._id)).status).toBe("accepted");
    expect((await request(app).patch(`/api/invitations/${idOf(invitation)}/respond`).send({ action: "decline" })).status).toBe(400);
    expect(other).toBeTruthy();
  });

  it("rejects invalid actions", async () => {
    const invitation = await Invitation.create({ project: project._id, invitedUser: invited._id, status: "pending" });
    expect((await request(app).patch(`/api/invitations/${idOf(invitation)}/respond`).send({ action: "maybe" })).status).toBe(400);
  });
});
