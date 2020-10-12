import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@stubhubclone/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/Order";

const setUp = async () => {
  //create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "fdsfas",
    userId: "fasfas",
    status: OrderStatus.Created,
    ticket: {
      id: "fdsfa",
      price: 20,
    },
  };

  //create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg };
};

it("replicates order info", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the msg", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
