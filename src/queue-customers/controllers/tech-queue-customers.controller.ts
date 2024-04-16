import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Patch,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import Roles from '../../roles/enums/role.enum';
import { QueueCustomerResponseDto } from '../dto/queue-customer-response.dto';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { CreateQueueCustomerDto } from '../dto/create-queue-customer.dto';
import { TechQueueCustomersService } from '../services/tech-queue-customers.service';
import { CustomersQueueQueryDTO } from '../dto/customers-queue-query.dto';
import { SwapQueueCustomersDto } from '../dto/swap-queue-customer.dto';
import { MoveQueueCustomersDto } from '../dto/move-queue-customer.dto';
import { AdminCodeQueryDTO } from '../dto/code-query.dto';

@ApiBearerAuth()
@ApiTags('Tech Queues')
@Controller('api-tech/queues')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class TechQueueCustomersController {
  constructor(
    private readonly techQueueCustomersService: TechQueueCustomersService,
  ) {}

  @ApiOperation({ summary: 'Adicionar participante na fila.' })
  @ApiResponse({
    status: 201,
    description: 'Participante adicionado na fila com sucesso.',
    type: QueueCustomerResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Valor de campo já em uso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fila não encontrada.',
  })
  @ApiBody({ type: CreateQueueCustomerDto })
  @Post(':id/customers')
  @Role([Roles.TECH])
  create(
    @Param() params: IDQueryDTO,
    @Body() dto: CreateQueueCustomerDto,
  ): Promise<QueueCustomerResponseDto> {
    return this.techQueueCustomersService.create(params.id, dto);
  }

  @ApiOperation({ summary: 'Obter listagem de participantes da fila.' })
  @ApiResponse({
    status: 200,
    description: 'Participantes da fila retornados com sucesso.',
    type: [QueueCustomerResponseDto],
  })
  @Get(':id/customers')
  @Role([Roles.TECH])
  findAll(@Param() params: IDQueryDTO): Promise<QueueCustomerResponseDto[]> {
    return this.techQueueCustomersService.findAll(params.id);
  }

  @ApiOperation({ summary: 'Obter participante da fila.' })
  @ApiResponse({
    status: 200,
    description: 'Participante da fila retornado com sucesso.',
    type: QueueCustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participante da fila não encontrado ou fila não encontrada.',
  })
  @Get(':id/customers/:customer_id')
  @Role([Roles.TECH])
  findOne(
    @Param() params: CustomersQueueQueryDTO,
  ): Promise<QueueCustomerResponseDto> {
    return this.techQueueCustomersService.findOne(
      params.id,
      params.customer_id,
    );
  }

  @ApiOperation({ summary: 'Deletar participante da fila.' })
  @ApiResponse({
    status: 204,
    description: 'Participante da fila deletado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Participante da fila não encontrado ou fila não encontrada.',
  })
  @HttpCode(204)
  @Delete(':id/customers/:customer_id')
  @Role([Roles.TECH])
  remove(@Param() params: CustomersQueueQueryDTO): Promise<void> {
    return this.techQueueCustomersService.remove(params.id, params.customer_id);
  }

  @ApiOperation({ summary: 'Obter local na fila pelo código.' })
  @ApiResponse({
    status: 200,
    description: 'Local na fila retornado com sucesso.',
    type: QueueCustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participante da fila não encontrado ou fila não encontrada.',
  })
  @Get(':id/customers/:code')
  @Role([Roles.TECH])
  findOneByCode(
    @Param() params: AdminCodeQueryDTO,
  ): Promise<QueueCustomerResponseDto> {
    return this.techQueueCustomersService.findOneByCode(params.id, params.code);
  }

  @ApiOperation({ summary: 'Trocar participantes de posição na fila.' })
  @ApiResponse({
    status: 200,
    description: 'Troca de posição realizada com sucesso.',
    type: [QueueCustomerResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Participante da fila não encontrado ou fila não encontrada.',
  })
  @Patch(':id/swap-positions')
  @Role([Roles.TECH])
  async swapPositions(
    @Param() params: IDQueryDTO,
    @Body() dto: SwapQueueCustomersDto,
  ): Promise<QueueCustomerResponseDto[]> {
    return this.techQueueCustomersService.swapPositions(params.id, dto);
  }

  @ApiOperation({ summary: 'Mover participantes de posição na fila.' })
  @ApiResponse({
    status: 204,
    description: 'Trocas de posição realizada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Fila não encontrada.',
  })
  @Put(':id/move-positions')
  @Role([Roles.TECH])
  async moveCustomers(
    @Param() params: IDQueryDTO,
    @Body() dto: MoveQueueCustomersDto,
  ): Promise<void> {
    return this.techQueueCustomersService.moveCustomers(params.id, dto);
  }
}
