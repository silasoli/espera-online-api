import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteCompanyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password da empresa.' })
  password: string;
}
