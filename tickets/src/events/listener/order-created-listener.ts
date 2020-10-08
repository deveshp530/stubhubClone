import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { Subjects, Listener, OrderCreatedEvent } from "@stubhubclone/common";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import mongoose from "mongoose";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //find ticket that odrder is reservec
    const ticket = await Ticket.findById(data.ticket.id);

    //if no tcket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //mark ticket as reserved
    ticket.set({ orderId: data.id });

    //save ticekt
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
