import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../schemas/company.entity';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';
import { Category } from '../../categories/schemas/category.entity';

export class ProfileCompanyResponseDto {
  constructor(company: Company) {
    const { _id, name, email, logo_url, category_id } = company;

    return {
      _id: String(_id),
      name,
      email,
      category: category_id,
      logo_url,
    };
  }

  @ApiProperty({ required: true })
  _id: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'É necessário informar o email do usuário.' })
  @IsEmail({}, { message: 'O email informado deve ser válido' })
  email: string;

  @ApiProperty({ required: true, type: () => CategoryResponseDto })
  category: Partial<Category> | null;

  @ApiProperty({ required: true })
  @IsString()
  logo_url: string | null;
}
