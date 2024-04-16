import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TechCompaniesService } from '../services/tech-companies.service';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CompanyQueryDto } from '../dto/company-query.dto';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';

@ApiTags('Customers Companies')
@Controller('companies')
export class CustomersCompaniesController {
  constructor(private readonly techCompaniesService: TechCompaniesService) {}

  @ApiOperation({ summary: 'Obter listagem de empresas' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de empresas retornada com sucesso',
    type: [CompanyResponseDto],
  })
  @Get()
  public async findAll(
    @Query() query: CompanyQueryDto,
  ): Promise<CompanyResponseDto[]> {
    return this.techCompaniesService.findAll(query);
  }

  @ApiOperation({ summary: 'Obter empresa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Empresa retornada com sucesso',
    type: CompanyResponseDto,
  })
  @Get(':id')
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<CompanyResponseDto> {
    return this.techCompaniesService.findOne(params.id);
  }
}
