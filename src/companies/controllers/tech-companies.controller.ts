import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { RoleGuard } from '../../roles/guards/role.guard';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CreateCompanyDto } from '../dto/company-user.dto';
import { TechCompaniesService } from '../services/tech-companies.service';
import { CompanyQueryDto } from '../dto/company-query.dto';

@ApiBearerAuth()
@ApiTags('Tech Companies')
@Controller('api-tech/companies')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class TechCompaniesController {
  constructor(private readonly techCompaniesService: TechCompaniesService) {}

  @ApiOperation({ summary: 'Criar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta de usuário criada com sucesso',
    type: CompanyResponseDto,
  })
  @ApiBody({ type: CreateCompanyDto })
  @Post()
  @Role([Roles.TECH])
  public async create(
    @Body() dto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.techCompaniesService.create(dto);
  }

  @ApiOperation({ summary: 'Obter listagem de contas dos usuários' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de contas dos usuários retornada com sucesso',
    type: [CompanyResponseDto],
  })
  @Get()
  @Role([Roles.TECH])
  public async findAll(
    @Query() query: CompanyQueryDto,
  ): Promise<CompanyResponseDto[]> {
    return this.techCompaniesService.findAll(query);
  }

  @ApiOperation({ summary: 'Obter conta do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Conta do usuário retornada com sucesso',
    type: CompanyResponseDto,
  })
  @Get(':id')
  @Role([Roles.TECH])
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<CompanyResponseDto> {
    return this.techCompaniesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar conta de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Editar conta de usuário com sucesso',
    type: CompanyResponseDto,
  })
  @ApiBody({ type: UpdateCompanyDto })
  @Patch(':id')
  @Role([Roles.TECH])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.techCompaniesService.update(params.id, dto);
  }

  @ApiOperation({ summary: 'Deletar conta de um usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta do usuário deletada com sucesso',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.TECH])
  public async remove(@Param() params: IDQueryDTO): Promise<void> {
    return this.techCompaniesService.remove(params.id);
  }
}
