import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CompanyQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  category?: string;
}
