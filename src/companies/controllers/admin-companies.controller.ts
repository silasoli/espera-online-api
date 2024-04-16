import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';
import { AdminCompaniesService } from '../services/admin-companies.service';
import { ProfileCompanyResponseDto } from '../dto/profile-company-response.dto';
import { UpdateProfileCompanyDto } from '../dto/update-profile-company.dto';

@ApiBearerAuth()
@ApiTags('Admin Companies')
@Controller('api-admin/companies/me')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminCompaniesController {
  constructor(private readonly adminCompaniesService: AdminCompaniesService) {}

  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
    type: ProfileCompanyResponseDto,
  })
  @Get()
  @Role([Roles.ADMIN])
  public async findProfile(
    @UserRequest() user: UserRequestDTO,
  ): Promise<ProfileCompanyResponseDto> {
    return this.adminCompaniesService.findProfile(user._id);
  }

  @ApiOperation({ summary: 'Atualizar perfil do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário atualizado com sucesso',
    type: ProfileCompanyResponseDto,
  })
  @ApiBody({ type: UpdateProfileCompanyDto })
  @Patch()
  @Role([Roles.ADMIN])
  public async updateProfile(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: UpdateProfileCompanyDto,
  ): Promise<ProfileCompanyResponseDto> {
    return this.adminCompaniesService.updateProfile(user._id, dto);
  }
}
