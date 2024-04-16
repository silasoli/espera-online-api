import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from '../../roles/guards/role.guard';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiBearerAuth()
@ApiTags('Tech Categories')
@Controller('api-tech/categories')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class TechCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Criar categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria criada com sucesso',
    type: CategoryResponseDto,
  })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  @Role([Roles.TECH])
  public async create(
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.create(dto);
  }

  @ApiOperation({ summary: 'Obter listagem de categorias' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de categorias retornada com sucesso',
    type: [CategoryResponseDto],
  })
  @Get()
  @Role([Roles.TECH])
  public async findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Obter categoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria retornada com sucesso',
    type: CategoryResponseDto,
  })
  @Get(':id')
  @Role([Roles.TECH])
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Editar categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria editada com sucesso',
    type: CategoryResponseDto,
  })
  @ApiBody({ type: CreateCategoryDto })
  @Patch(':id')
  @Role([Roles.TECH])
  public async update(
    @Param() params: IDQueryDTO,
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.update(params.id, dto);
  }
}
