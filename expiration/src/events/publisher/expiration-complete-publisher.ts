import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@stubhubclone/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
