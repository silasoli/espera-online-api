import { ApiProperty } from '@nestjs/swagger';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateQueueCustomerDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o seu nome.' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @MinLength(5, { message: 'O nome deve ser maior que 4 caracteres' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o seu telefone.' })
  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsMobilePhone(
    'pt-BR',
    { strictMode: false },
    { message: 'O telefone deve ser válido' },
  )
  phone: string;
}
