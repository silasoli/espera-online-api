import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IDQueryDTO } from '../../common/dtos/id-query.dto';
import { QueueResponseDto } from '../dto/queue-response.dto';
import { TechQueuesService } from '../services/tech-queues.service';

@ApiTags('Customers Companies')
@Controller('companies')
export class CustomersQueuesController {
  constructor(private readonly techQueuesService: TechQueuesService) { }

  @ApiOperation({ summary: 'Obter filas de uma empresa' })
  @ApiResponse({
    status: 200,
    description: 'Filas retornadas com sucesso.',
    type: [QueueResponseDto],
  })
  @Get(':id/queues')
  public async findQueuesByCompany(
    @Param() params: IDQueryDTO,
  ): Promise<QueueResponseDto[]> {
    return this.techQueuesService.findQueuesByCompany(params.id);
  }
}
