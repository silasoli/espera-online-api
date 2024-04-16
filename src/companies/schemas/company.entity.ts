import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import Role from '../../roles/enums/role.enum';
import { Category } from '../../categories/schemas/category.entity';

export type CompanyDocument = Company & Document;
@Schema()
export class Company {
  _id?: mongoose.ObjectId | string;

  @Prop({ required: true, unique: true, lowercase: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: false, default: null })
  logo_url: string | null;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: mongoose.Schema.Types.Array, select: false })
  roles: Role[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
    default: null
  })
  category_id: Category | null;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updateAt: Date;

  @Prop({ default: () => new Date() })
  deactiveAt: Date;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
