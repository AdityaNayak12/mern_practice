import request from "supertest";
import jwt from "jsonwebtoken";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Article from "../src/models/article.model.js";
import User from "../src/models/user.model.js";
import { authenticate } from "../src/middleware/authenticate.js";
import { getPremiumArticle } from "../src/controllers/q05.controller.js";
import { appWithMiddleware, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

process.env.JWT_SECRET = "practice-secret";

describe("Q05 premium content", () => {
  let user;
  let article;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "premium@example.com", subscription: { plan: "premium", expiresAt: new Date(Date.now() + 86_400_000) } });
    article = await Article.create({ title: "Private article", body: "Premium body" });
    app = appWithMiddleware("get", "/api/articles/:articleId/premium", authenticate, getPremiumArticle);
  });

  it("authenticates from the token cookie and returns the article", async () => {
    const token = jwt.sign({ userId: idOf(user) }, process.env.JWT_SECRET);
    const response = await request(app).get(`/api/articles/${idOf(article)}/premium`).set("Cookie", `token=${token}`);
    expect(response.status).toBe(200);
    expect(response.body.article.title).toBe("Private article");
  });

  it("rejects missing/invalid authentication and inactive premium access", async () => {
    expect((await request(app).get(`/api/articles/${idOf(article)}/premium`)).status).toBe(401);
    expect((await request(app).get(`/api/articles/${idOf(article)}/premium`).set("Cookie", "token=bad")).status).toBe(401);
    await User.updateOne({ _id: user._id }, { $set: { "subscription.plan": "free" } });
    const token = jwt.sign({ userId: idOf(user) }, process.env.JWT_SECRET);
    expect((await request(app).get(`/api/articles/${idOf(article)}/premium`).set("Cookie", `token=${token}`)).status).toBe(403);
  });
});
