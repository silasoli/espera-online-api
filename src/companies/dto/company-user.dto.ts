import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o nome da empresa.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email da empresa.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o password da empresa.' })
  password: string;

  @ApiProperty({ required: true, description: 'Envie um ID válido do MongoDB' })
  @IsString({ message: 'O ID deve ser uma string.' })
  @IsNotEmpty({ message: 'O ID não pode estar vazio.' })
  @IsMongoId({ message: 'O ID fornecido não está em um formato válido.' })
  category_id: string;
}
