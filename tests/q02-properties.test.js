import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Property from "../src/models/property.model.js";
import { searchProperties } from "../src/controllers/q02.controller.js";
import { appFor } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q02 search properties", () => {
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    await Property.insertMany([
      { title: "Lake View", city: "Bengaluru", rent: 20000, bedrooms: 2, available: true },
      { title: "Lake House", city: "Bengaluru", rent: 30000, bedrooms: 3, available: true },
      { title: "Garden Flat", city: "Bengaluru", rent: 15000, bedrooms: 2, available: false },
      { title: "Sea View", city: "Mumbai", rent: 25000, bedrooms: 2, available: true }
    ]);
    app = appFor("get", "/api/properties", searchProperties);
  });

  it("returns only available properties and combines filters", async () => {
    const response = await request(app).get("/api/properties").query({
      city: "Bengaluru", minRent: 20000, maxRent: 30000, bedrooms: 2,
      search: "lake", sort: "rent_low"
    });
    expect(response.status).toBe(200);
    expect(response.body.properties).toHaveLength(2);
    expect(response.body.properties.map(({ title }) => title)).toEqual(["Lake View", "Lake House"]);
  });

  it.each([
    { sort: "random" },
    { minRent: "hello" }
  ])("rejects invalid query %#", async (query) => {
    const response = await request(app).get("/api/properties").query(query);
    expect(response.status).toBe(400);
  });
});
