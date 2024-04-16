import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './company-user.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
