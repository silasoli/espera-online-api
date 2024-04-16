import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CodeQueryDTO {
  @ApiProperty({
    required: true,
    description: 'Envie um código válido',
  })
  @IsString({ message: 'O código deve ser uma string.' })
  @IsNotEmpty({ message: 'O código não pode estar vazio.' })
  code: string;
}


export class AdminCodeQueryDTO {
  @ApiProperty({ required: true, description: 'Envie um id válido do mongoDB' })
  @IsString({ message: 'O ID deve ser uma string.' })
  @IsNotEmpty({ message: 'O ID não pode estar vazio.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  id: string;

  @ApiProperty({
    required: true,
    description: 'Envie um código válido',
  })
  @IsString({ message: 'O código deve ser uma string.' })
  @IsNotEmpty({ message: 'O código não pode estar vazio.' })
  code: string;
}
