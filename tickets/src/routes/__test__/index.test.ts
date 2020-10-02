import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { createTicketRouter } from "../newTicket";
import { response } from "express";


const createTicket = () => {
  return request(app).post("/api/tickets").set("Cookie", global.signin()).send({
    title: 'fsadfsa',
    price: 45,
  });
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get("/api/tickets").send().expect(200);

  expect(res.body.length).toEqual(4);
});
