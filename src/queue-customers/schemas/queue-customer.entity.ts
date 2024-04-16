import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Queue } from '../../queues/schemas/queue.entity';

export type QueueCustomerDocument = QueueCustomer & Document;

@Schema()
export class QueueCustomer {
  _id?: mongoose.ObjectId | string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Queue',
    required: true,
  })
  queue_id: Queue;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  position: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updateAt: Date;
}

export const QueueCustomerSchema = SchemaFactory.createForClass(QueueCustomer);
