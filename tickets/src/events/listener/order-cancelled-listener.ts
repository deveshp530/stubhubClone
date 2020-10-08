import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { Subjects, Listener, OrderCancelledEvent } from "@stubhubclone/common";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    //find ticket that odrder is reservec
    const ticket = await Ticket.findById(data.ticket.id);

    //if no tcket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    //mark ticket as reserved
    ticket.set({ orderId: undefined });

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
