import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateQueueCustomerDto } from '../dto/create-queue-customer.dto';
import { QueueCustomerResponseDto } from '../dto/queue-customer-response.dto';
import { CustomersQueueQueryDTO } from '../dto/customers-queue-query.dto';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { QueueCustomersService } from '../services/queue-customers.service';
import { CodeQueryDTO } from '../dto/code-query.dto';

@ApiTags('Customers Queues')
@Controller('queues')
export class QueueCustomersController {
  constructor(private readonly queueCustomersService: QueueCustomersService) {}

  @ApiOperation({ summary: 'Entrar na fila.' })
  @ApiResponse({
    status: 201,
    description: 'Entrou na fila com sucesso.',
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
  create(
    @Param() params: IDQueryDTO,
    @Body() dto: CreateQueueCustomerDto,
  ): Promise<QueueCustomerResponseDto> {
    return this.queueCustomersService.create(params.id, dto);
  }

  @ApiOperation({ summary: 'Obter local na fila.' })
  @ApiResponse({
    status: 200,
    description: 'Local na fila retornado com sucesso.',
    type: QueueCustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participante da fila não encontrado ou fila não encontrada.',
  })
  @Get(':id/customers/:id')
  findOne(
    @Param() params: CustomersQueueQueryDTO,
  ): Promise<QueueCustomerResponseDto> {
    return this.queueCustomersService.findOne(params.customer_id, params.id);
  }

  @ApiOperation({ summary: 'Obter local na fila pelo código.' })
  @ApiResponse({
    status: 200,
    description: 'Local na fila retornado com sucesso.',
    type: QueueCustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participante da fila não encontrado',
  })
  @Get('customers/:code')
  findOneByCode(
    @Param() params: CodeQueryDTO,
  ): Promise<QueueCustomerResponseDto> {
    return this.queueCustomersService.findOneByCode(params.code);
  }
}
