import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();
  return ticket;
};

it("fetches order for a particular user", async () => {
  // create three tickets
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();
  //create one order as user #1

  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: t1.id })
    .expect(201);

  //create two orders as user #2
  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: t2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: t3.id })
    .expect(201);

  //make request to get orders for user #2
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  //make sure we only got orders for user #2

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
  expect(response.body[0].ticket.id).toEqual(t2.id);
  expect(response.body[1].ticket.id).toEqual(t3.id);
});
