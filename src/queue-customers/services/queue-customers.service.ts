import { Injectable, NotFoundException } from '@nestjs/common';
import {
  QueueCustomer,
  QueueCustomerDocument,
} from '../schemas/queue-customer.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQueueCustomerDto } from '../dto/create-queue-customer.dto';
import { QueueCustomerResponseDto } from '../dto/queue-customer-response.dto';
import { TechQueuesService } from '../../queues/services/tech-queues.service';
import * as crypto from 'crypto';

@Injectable()
export class QueueCustomersService {
  constructor(
    @InjectModel(QueueCustomer.name)
    private queueCustomerModel: Model<QueueCustomerDocument>,
    private readonly techQueuesService: TechQueuesService,
  ) {}

  private async generateCustomerCode() {
    let isCodeUnique = false;
    let code: string;

    while (!isCodeUnique) {
      code = crypto.randomBytes(2).toString('hex').toUpperCase();
      const existingCustomer = await this.queueCustomerModel.findOne({ code });

      if (!existingCustomer) isCodeUnique = true;
    }

    return code;
  }

  public async create(
    _id: string,
    dto: CreateQueueCustomerDto,
  ): Promise<QueueCustomerResponseDto> {
    const queue_id = _id;

    const queue = await this.techQueuesService.findOne(queue_id);

    const position = (await this.queueCustomerModel.count({ queue_id })) + 1;

    const code = await this.generateCustomerCode();

    const created = await this.queueCustomerModel.create({
      position,
      queue_id,
      code,
      ...dto,
    });

    return new QueueCustomerResponseDto(created, queue.averageWaitTime);
  }

  private async findQueueCustomerByID(
    queue_id: string,
    customer_id: string,
  ): Promise<QueueCustomer> {
    const queueCustomer = await this.queueCustomerModel.findOne({
      queue_id,
      _id: customer_id,
    });

    if (!queueCustomer)
      throw new NotFoundException('Pessoa não encontrada nessa fila.');

    return queueCustomer;
  }

  public async findOne(
    customer_id: string,
    queue_id: string,
  ): Promise<QueueCustomerResponseDto> {
    const queue = await this.techQueuesService.findOne(queue_id);

    const queueCustomer = await this.findQueueCustomerByID(
      queue_id,
      customer_id,
    );

    return new QueueCustomerResponseDto(queueCustomer, queue.averageWaitTime);
  }

  public async findOneByCode(code: string): Promise<QueueCustomerResponseDto> {
    const queueCustomer = await this.queueCustomerModel.findOne({ code });

    if (!queueCustomer) throw new NotFoundException('Código inválido');

    const queue = await this.techQueuesService.findOne(
      queueCustomer.queue_id._id.toString(),
    );

    return new QueueCustomerResponseDto(queueCustomer, queue.averageWaitTime);
  }

  public async remove(customer_id: string, queue_id: string) {
    await this.techQueuesService.findOne(queue_id);
    await this.findQueueCustomerByID(queue_id, customer_id);
    await this.queueCustomerModel.deleteOne({
      queue_id,
      _id: customer_id,
    });
  }
}
