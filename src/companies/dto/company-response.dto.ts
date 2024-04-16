import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import Roles from '../../roles/enums/role.enum';
import { Company } from '../schemas/company.entity';
import { Category } from '../../categories/schemas/category.entity';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class CompanyResponseDto {
  constructor(company: Company) {
    const { _id, name, email, roles, category_id } = company;

    return {
      _id: String(_id),
      name,
      email,
      category: category_id,
      roles,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  @IsString({ message: 'O Nome da empresa deve ser um texto' })
  @IsNotEmpty({ message: 'É necessário informar o nome da empresa.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email da empresa.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true, type: () => CategoryResponseDto })
  category: Partial<Category> | null;


  @ApiProperty({ required: true })
  roles: Roles[];
}
