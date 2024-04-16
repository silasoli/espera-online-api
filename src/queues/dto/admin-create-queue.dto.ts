import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class AdminCreateQueueDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o nome da fila.' })
  @IsString({ message: 'O nome da fila deve ser uma string.' })
  @MinLength(5, { message: 'O nome da fila deve ser maior que 4 caracteres' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Envie o ID da empresa criadora da fila.' })
  @IsString({ message: 'O ID da empresa deve ser uma string.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  company_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'Envie o tempo médio de espera da fila em minutos'})
  averageWaitTime?: number;
}
