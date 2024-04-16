import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './company-user.dto';

export class UpdateProfileCompanyDto extends PartialType(
  OmitType(CreateCompanyDto, ['password'] as const),
) { }