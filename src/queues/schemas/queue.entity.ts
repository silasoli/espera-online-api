import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../companies/schemas/company.entity';

export type QueueDocument = Queue & Document;

@Schema()
export class Queue {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, lowercase: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  })
  company_id: Company;

  @Prop({ default: 0 })
  averageWaitTime: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updateAt: Date;
}

export const QueueSchema = SchemaFactory.createForClass(Queue);
