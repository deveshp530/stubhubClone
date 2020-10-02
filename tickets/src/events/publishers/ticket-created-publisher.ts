import { Publisher, Subjects, TicketCreatedEvent } from '@stubhubclone/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
