import { ApiProperty } from '@nestjs/swagger';
import { QueueCustomer } from '../schemas/queue-customer.entity';

export class QueueCustomerResponseDto {
  constructor(queueCustomer: QueueCustomer, waitTime: number = 0) {
    return {
      _id: String(queueCustomer._id),
      name: queueCustomer.name,
      code: queueCustomer.code,
      phone: queueCustomer.phone,
      position: queueCustomer.position,
      averageWaitTime: waitTime * queueCustomer.position,
      queue_id: String(queueCustomer.queue_id),
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  code: string;

  @ApiProperty({ required: true })
  phone: string;

  @ApiProperty({ required: true })
  position: number;

  @ApiProperty({ required: true })
  averageWaitTime: number

  @ApiProperty({ required: true })
  queue_id: string;
}
