import { Publisher, Subjects, TicketCreatedUpdated } from '@stubhubclone/common';

export class TicketUpdatedPublisher extends Publisher<TicketCreatedUpdated> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
