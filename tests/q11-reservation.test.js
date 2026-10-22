import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Reservation from "../src/models/reservation.model.js";
import Room from "../src/models/room.model.js";
import User from "../src/models/user.model.js";
import { cancelReservation } from "../src/controllers/q11.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q11 cancel reservation", () => {
  let user;
  let room;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "guest@example.com" });
    room = await Room.create({ name: "101", availableRooms: 2 });
    app = appFor("post", "/api/reservations/:reservationId/cancel", (req, res, next) => {
      req.user = { _id: user._id };
      return cancelReservation(req, res, next);
    });
  });

  it("cancels a confirmed reservation and releases the room", async () => {
    const reservation = await Reservation.create({ user: user._id, room: room._id, checkIn: new Date(Date.now() + 72 * 3_600_000), status: "confirmed" });
    const response = await request(app).post(`/api/reservations/${idOf(reservation)}/cancel`);
    expect(response.status).toBe(200);
    expect((await Reservation.findById(reservation._id)).status).toBe("cancelled");
    expect((await Room.findById(room._id)).availableRooms).toBe(3);
  });

  it("rejects invalid state and cancellation inside 24 hours", async () => {
    expect((await request(app).post("/api/reservations/nope/cancel")).status).toBe(400);
    const soon = await Reservation.create({ user: user._id, room: room._id, checkIn: new Date(Date.now() + 10 * 3_600_000), status: "confirmed" });
    expect((await request(app).post(`/api/reservations/${idOf(soon)}/cancel`)).status).toBe(400);
    const done = await Reservation.create({ user: user._id, room: room._id, checkIn: new Date(Date.now() + 72 * 3_600_000), status: "completed" });
    expect((await request(app).post(`/api/reservations/${idOf(done)}/cancel`)).status).toBe(400);
  });
});
