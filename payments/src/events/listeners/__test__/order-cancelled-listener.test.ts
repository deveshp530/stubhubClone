import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@stubhubclone/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/Order";

const setUp = async () => {
  //create instance of listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "fasdf",
    version: 0,
  });

  await order.save();

  //create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "fsdfas",
      price: 20,
    },
  };

  //create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("updates status of order", async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the msg", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
