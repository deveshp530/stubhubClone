import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@stubhubclone/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/tickets";

const setUp = async () => {
  //create instance of listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 30,
    userId: "fsadfsad",
  });

  ticket.set({ orderId });
  await ticket.save();

  //create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, ticket, orderId };
};

it("updates ticket", async () => {
  const { listener, data, msg, ticket, orderId } = await setUp();
  //call on message function with the data and msg object
  await listener.onMessage(data, msg);

  //write assersions to make sure ticket was Cancelled
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setUp();

  //call on message function with the data and msg object
  await listener.onMessage(data, msg);

  //make sure ack was called
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket cancelled event", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
