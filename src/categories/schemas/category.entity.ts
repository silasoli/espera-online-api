import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updateAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
