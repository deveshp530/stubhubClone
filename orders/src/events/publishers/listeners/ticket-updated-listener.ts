import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { Subjects, Listener, TicketUpdatedEvent } from "@stubhubclone/common";
import { queueGroupName } from "./queue-group-name";

export class TickerUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
