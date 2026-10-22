import request from "supertest";
import mongoose from "mongoose";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Appointment from "../src/models/appointment.model.js";
import User from "../src/models/user.model.js";
import { rescheduleAppointment } from "../src/controllers/q06.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q06 reschedule appointment", () => {
  let patient;
  let doctor;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    [patient, doctor] = await User.create([{ email: "patient@example.com" }, { email: "doctor@example.com" }]);
    app = appFor("patch", "/api/appointments/:appointmentId/reschedule", (req, res, next) => {
      req.user = { _id: patient._id };
      return rescheduleAppointment(req, res, next);
    });
  });

  it("reschedules to an available future time", async () => {
    const appointment = await Appointment.create({ patient: patient._id, doctor: doctor._id, scheduledFor: new Date(Date.now() + 86_400_000), status: "scheduled" });
    const nextTime = new Date(Date.now() + 172_800_000).toISOString();
    const response = await request(app).patch(`/api/appointments/${idOf(appointment)}/reschedule`).send({ scheduledFor: nextTime });
    expect(response.status).toBe(200);
    expect(new Date(response.body.appointment.scheduledFor).toISOString()).toBe(nextTime);
  });

  it("rejects invalid, past, unauthorized, completed, and conflicting changes", async () => {
    expect((await request(app).patch("/api/appointments/nope/reschedule").send({ scheduledFor: new Date(Date.now() + 86_400_000) })).status).toBe(400);
    const appointment = await Appointment.create({ patient: patient._id, doctor: doctor._id, scheduledFor: new Date(Date.now() + 86_400_000), status: "scheduled" });
    expect((await request(app).patch(`/api/appointments/${idOf(appointment)}/reschedule`).send({ scheduledFor: "nope" })).status).toBe(400);
    expect((await request(app).patch(`/api/appointments/${idOf(appointment)}/reschedule`).send({ scheduledFor: new Date(Date.now() - 1_000) })).status).toBe(400);
    await Appointment.updateOne({ _id: appointment._id }, { patient: new mongoose.Types.ObjectId() });
    expect((await request(app).patch(`/api/appointments/${idOf(appointment)}/reschedule`).send({ scheduledFor: new Date(Date.now() + 172_800_000) })).status).toBe(403);
  });
});
