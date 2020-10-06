import { Publisher, Subjects, TicketUpdatedEvent } from '@stubhubclone/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
