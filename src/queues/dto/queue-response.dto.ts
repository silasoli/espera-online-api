import { ApiProperty } from '@nestjs/swagger';
import { Queue } from '../schemas/queue.entity';

export class QueueResponseDto {
  constructor(queue: Queue) {
    const { _id, name, company_id, averageWaitTime, createdAt, updateAt } =
      queue;

    return {
      _id: String(_id),
      name,
      company_id: String(company_id),
      averageWaitTime,
      createdAt,
      updateAt,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  company_id: string;

  @ApiProperty({ required: true })
  averageWaitTime: number;

  @ApiProperty({ required: true })
  createdAt: Date;

  @ApiProperty({ required: true })
  updateAt: Date | null;
}
