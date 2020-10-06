import {Publisher, OrderCreatedEvent, Subjects} from '@stubhubclone/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated

    
}