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
import { CustomersQueueQueryDTO } from '../dto/customers-queue-query.dto';
import { SwapQueueCustomersDto } from '../dto/swap-queue-customer.dto';
import { UserRequest } from '../../auth/decorators/user-request.decorator';
import { UserRequestDTO } from '../../common/dtos/user-request.dto';
import { AdminQueueCustomersService } from '../services/admin-queue-customers.service';
import { MoveQueueCustomersDto } from '../dto/move-queue-customer.dto';
import { AdminCodeQueryDTO } from '../dto/code-query.dto';

@ApiBearerAuth()
@ApiTags('Admin Queues')
@Controller('api-admin/queues')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class AdminQueueCustomersController {
  constructor(
    private readonly adminQueueCustomersService: AdminQueueCustomersService,
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
  @Role([Roles.ADMIN])
  create(
    @UserRequest() company: UserRequestDTO,
    @Param() params: IDQueryDTO,
    @Body() dto: CreateQueueCustomerDto,
  ): Promise<QueueCustomerResponseDto> {
    return this.adminQueueCustomersService.create(company._id, params.id, dto);
  }

  @ApiOperation({ summary: 'Obter listagem de participantes da fila.' })
  @ApiResponse({
    status: 200,
    description: 'Participantes da fila retornados com sucesso.',
    type: [QueueCustomerResponseDto],
  })
  @Get(':id/customers')
  @Role([Roles.ADMIN])
  findAll(
    @UserRequest() company: UserRequestDTO,
    @Param() params: IDQueryDTO,
  ): Promise<QueueCustomerResponseDto[]> {
    return this.adminQueueCustomersService.findAll(company._id, params.id);
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
  @Role([Roles.ADMIN])
  findOne(
    @UserRequest() company: UserRequestDTO,
    @Param() params: CustomersQueueQueryDTO,
  ): Promise<QueueCustomerResponseDto> {
    return this.adminQueueCustomersService.findOne(
      company._id,
      params.id,
      params.customer_id,
    );
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
  @Role([Roles.ADMIN])
  findOneByCode(
    @UserRequest() company: UserRequestDTO,
    @Param() params: AdminCodeQueryDTO,
  ): Promise<QueueCustomerResponseDto> {
    return this.adminQueueCustomersService.findOneByCode(
      company._id,
      params.id,
      params.code,
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
  @Role([Roles.ADMIN])
  remove(
    @UserRequest() company: UserRequestDTO,
    @Param() params: CustomersQueueQueryDTO,
  ): Promise<void> {
    return this.adminQueueCustomersService.remove(
      company._id,
      params.id,
      params.customer_id,
    );
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
  @Role([Roles.ADMIN])
  async swapPositions(
    @UserRequest() company: UserRequestDTO,
    @Param() params: IDQueryDTO,
    @Body() dto: SwapQueueCustomersDto,
  ): Promise<QueueCustomerResponseDto[]> {
    return this.adminQueueCustomersService.swapPositions(
      company._id,
      params.id,
      dto,
    );
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
  @Role([Roles.ADMIN])
  async moveCustomers(
    @Param() params: IDQueryDTO,
    @Body() dto: MoveQueueCustomersDto,
  ): Promise<void> {
    return this.adminQueueCustomersService.moveCustomers(params.id, dto);
  }
}
