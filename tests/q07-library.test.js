import request from "supertest";
import { beforeAll, beforeEach, afterAll, describe, expect, it } from "vitest";
import Book from "../src/models/book.model.js";
import User from "../src/models/user.model.js";
import { borrowBook } from "../src/controllers/q07.controller.js";
import { appFor, idOf } from "./support/app.js";
import { clearDatabase, startDatabase, stopDatabase } from "./support/mongo.js";

describe("Q07 borrow book", () => {
  let user;
  let app;
  beforeAll(startDatabase);
  afterAll(stopDatabase);
  beforeEach(async () => {
    await clearDatabase();
    user = await User.create({ email: "reader@example.com", borrowedBooks: [] });
    app = appFor("post", "/api/books/:bookId/borrow", (req, res, next) => {
      req.user = { _id: user._id };
      return borrowBook(req, res, next);
    });
  });

  it("adds the book to the user and decrements inventory", async () => {
    const book = await Book.create({ title: "MERN", availableCopies: 2 });
    const response = await request(app).post(`/api/books/${idOf(book)}/borrow`);
    expect(response.status).toBe(200);
    const [savedBook, savedUser] = await Promise.all([Book.findById(book._id), User.findById(user._id)]);
    expect(savedBook.availableCopies).toBe(1);
    expect(savedUser.borrowedBooks.map(String)).toContain(idOf(book));
  });

  it("rejects a duplicate, a fourth book, and empty inventory", async () => {
    const duplicate = await Book.create({ title: "Duplicate", availableCopies: 1 });
    await User.updateOne({ _id: user._id }, { borrowedBooks: [duplicate._id] });
    expect((await request(app).post(`/api/books/${idOf(duplicate)}/borrow`)).status).toBe(400);
    await User.updateOne({ _id: user._id }, { borrowedBooks: [new Book()._id, new Book()._id, new Book()._id] });
    const available = await Book.create({ title: "Fourth", availableCopies: 1 });
    expect((await request(app).post(`/api/books/${idOf(available)}/borrow`)).status).toBe(400);
    await User.updateOne({ _id: user._id }, { borrowedBooks: [] });
    const empty = await Book.create({ title: "Empty", availableCopies: 0 });
    expect((await request(app).post(`/api/books/${idOf(empty)}/borrow`)).status).toBe(400);
  });
});
