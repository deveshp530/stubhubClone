import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent, OrderStatus } from "@stubhubclone/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/Ticket";
import { Order } from "../../../models/Order";

const setUp = async () => {
  //create instance of listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "fsaf",
    price: 20,
    id: mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const order = Order.build({
    userId: "fasfdsa",
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
  });

  await order.save();
  //create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order, ticket };
};

it("updates orderstatus to cancelled", async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an order cancelled event", async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
