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
} from '@nestjs/common';
import { AdminCreateQueueDto } from '../dto/admin-create-queue.dto';
import { AdminUpdateQueueDto } from '../dto/admin-update-queue.dto';
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
import { QueueResponseDto } from '../dto/queue-response.dto';
import { TechQueuesService } from '../services/tech-queues.service';

@ApiBearerAuth()
@ApiTags('Tech Queues')
@Controller('api-tech/queues')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class TechQueuesController {
  constructor(private readonly techQueuesService: TechQueuesService) {}

  @ApiOperation({ summary: 'Criar Fila.' })
  @ApiResponse({
    status: 200,
    description: 'Fila criada com sucesso.',
    type: QueueResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiBody({ type: AdminCreateQueueDto })
  @Post()
  @Role([Roles.TECH])
  create(@Body() dto: AdminCreateQueueDto): Promise<QueueResponseDto> {
    return this.techQueuesService.create(dto);
  }

  @ApiOperation({ summary: 'Obter filas.' })
  @ApiResponse({
    status: 200,
    description: 'Filas retornadas com sucesso.',
    type: [QueueResponseDto],
  })
  @Get()
  @Role([Roles.TECH])
  findAll(): Promise<QueueResponseDto[]> {
    return this.techQueuesService.findAll();
  }

  @ApiOperation({ summary: 'Obter fila.' })
  @ApiResponse({
    status: 200,
    description: 'Fila retornada com sucesso.',
    type: QueueResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Fila não encontrada.',
  })
  @Get(':id')
  @Role([Roles.TECH])
  findOne(@Param('id') id: string): Promise<QueueResponseDto> {
    return this.techQueuesService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar fila.' })
  @ApiResponse({
    status: 200,
    description: 'Fila atualizada com sucesso.',
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
  @ApiBody({ type: AdminUpdateQueueDto })
  @Patch(':id')
  @Role([Roles.TECH])
  update(
    @Param('id') id: string,
    @Body() dto: AdminUpdateQueueDto,
  ): Promise<QueueResponseDto> {
    return this.techQueuesService.update(id, dto);
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
  @Role([Roles.TECH])
  remove(@Param('id') id: string): Promise<void> {
    return this.techQueuesService.remove(id);
  }
}
