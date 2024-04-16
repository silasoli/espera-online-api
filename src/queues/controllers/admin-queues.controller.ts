import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';
import { UserCreateQueueDto } from '../dto/user-create-queue.dto';
import { UserUpdateQueueDto } from '../dto/user-update-queue.dto';
import { QueueResponseDto } from '../dto/queue-response.dto';
import { AdminQueuesService } from '../services/admin-queues.service';

@ApiBearerAuth()
@ApiTags('Admin Queues')
@Controller('api-admin/queues')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminQueuesController {
  constructor(private readonly adminQueuesService: AdminQueuesService) {}

  @ApiOperation({ summary: 'Criar fila.' })
  @ApiResponse({
    status: 200,
    description: 'Fila criada com sucesso.',
    type: QueueResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiBody({ type: UserCreateQueueDto })
  @Post()
  @Role([Roles.ADMIN])
  create(
    @UserRequest() user: UserRequestDTO,
    @Body() dto: UserCreateQueueDto,
  ): Promise<QueueResponseDto> {
    return this.adminQueuesService.createToCompany(user._id, dto);
  }

  @ApiOperation({ summary: 'Obter filas do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Filas do usuário retornadas com sucesso.',
    type: [QueueResponseDto],
  })
  @Get()
  @Role([Roles.ADMIN])
  findAll(@UserRequest() user: UserRequestDTO): Promise<QueueResponseDto[]> {
    return this.adminQueuesService.findAllQueuesOfCompany(user._id);
  }

  @ApiOperation({ summary: 'Obter fila do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Fila do usuário retornada com sucesso.',
    type: QueueResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Fila não encontrada.',
  })
  @Get(':id')
  @Role([Roles.ADMIN])
  findOne(@UserRequest() user: UserRequestDTO, @Param('id') id: string) {
    return this.adminQueuesService.findOneQueueOfCompany(user._id, id);
  }

  @ApiOperation({ summary: 'Atualizar fila do usuário.' })
  @ApiResponse({
    status: 200,
    description: 'Fila do usuário atualizada com sucesso.',
    type: QueueResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Fila não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiBody({ type: UserUpdateQueueDto })
  @Patch(':id')
  @Role([Roles.ADMIN])
  update(
    @UserRequest() user: UserRequestDTO,
    @Param('id') id: string,
    @Body() dto: UserUpdateQueueDto,
  ) {
    return this.adminQueuesService.update(user._id, id, dto);
  }

  @ApiOperation({ summary: 'Deletar fila.' })
  @ApiResponse({
    status: 204,
    description: 'Fila deletada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fila não encontrada.',
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  remove(
    @UserRequest() company: UserRequestDTO,
    @Param('id') id: string,
  ): Promise<void> {
    return this.adminQueuesService.remove(company._id, id);
  }
}
