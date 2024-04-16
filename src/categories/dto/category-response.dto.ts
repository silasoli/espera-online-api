import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schemas/category.entity';

export class CategoryResponseDto {
  constructor(category: Category) {
    const { _id, name, slug } = category;

    return { _id: String(_id), name, slug };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  slug: string;
}
