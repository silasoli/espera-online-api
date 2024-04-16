import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';

class MoveCustomersDto {
  @ApiProperty({ required: true, description: 'Envie um ID válido do MongoDB' })
  @IsString({ message: 'O ID deve ser uma string.' })
  @IsNotEmpty({ message: 'O ID não pode estar vazio.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  _id: string;

  @ApiProperty({
    required: true,
    description: 'Nova posição do cliente na fila',
  })
  @IsNotEmpty({ message: 'A posição não pode estar vazia.' })
  @IsInt({ message: 'O número de posições deve ser inteiro.' })
  position: number;
}

export class MoveQueueCustomersDto {
  @ApiProperty({
    type: [MoveCustomersDto],
    description: 'Array de movimentos de clientes',
  })
  @IsArray({ message: 'queueCustomers deve ser um Array.' })
  @ValidateNested({ each: true })
  @Type(() => MoveCustomersDto)
  @IsNotEmpty({ message: 'O array não pode estar vazio.' })
  queueCustomers: MoveCustomersDto[];
}
