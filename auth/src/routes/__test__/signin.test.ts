import request from "supertest";
import { app } from "../../app";

it("fails when email does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "fajsdkfsakj",
    })
    .expect(400);
});

it("fails when incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "fajsdkfsakj",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "badpassword",
    })
    .expect(400);
});

it("responds with a cookie with valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "fajsdkfsakj",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "fajsdkfsakj",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
