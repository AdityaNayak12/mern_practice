import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let server;

export async function startDatabase() {
  server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
}

export async function clearDatabase() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }
}

export async function stopDatabase() {
  await mongoose.disconnect();
  await server?.stop();
  server = undefined;
}
