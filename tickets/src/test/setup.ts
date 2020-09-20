import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdafasfs";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //build JWT payload
  const payload = {
    id: "fsdfsa",
    email: "test@test.com",
  };

  //create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object
  const session = { jwt: token };

  //turn session into JSON
  const sessionJSON = JSON.stringify(session);

  //take json and encode to base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return string of encoded data
  return [`express:sess=${base64}`];
};
