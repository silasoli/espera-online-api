import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome da categoria.' })
  @MinLength(5, { message: 'A categoria deve conter no minimo 5 digitos' })
  name: string;
}
