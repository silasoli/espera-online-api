import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { CategoryResponseDto } from '../dto/category-response.dto';

@ApiBearerAuth()
@ApiTags('Admin Categories')
@Controller('api-admin/categories')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Obter listagem de categorias' })
  @ApiResponse({
    status: 200,
    description: 'Listagem de categorias retornadas com sucesso',
    type: [CategoryResponseDto],
  })
  @Get()
  @Role([Roles.ADMIN])
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
  @Role([Roles.ADMIN])
  public async findOne(
    @Param() params: IDQueryDTO,
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.findOne(params.id);
  }
}
