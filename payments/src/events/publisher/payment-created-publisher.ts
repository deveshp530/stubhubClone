import {Publisher, PaymentCreatedEvent, Subjects} from '@stubhubclone/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated

}