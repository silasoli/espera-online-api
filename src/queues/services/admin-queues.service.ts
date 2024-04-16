import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue, QueueDocument } from '../schemas/queue.entity';
import { Model } from 'mongoose';
import { UserCreateQueueDto } from '../dto/user-create-queue.dto';
import { QueueResponseDto } from '../dto/queue-response.dto';
import { UserUpdateQueueDto } from '../dto/user-update-queue.dto';
import {
  QueueCustomer,
  QueueCustomerDocument,
} from '../../queue-customers/schemas/queue-customer.entity';

@Injectable()
export class AdminQueuesService {
  constructor(
    @InjectModel(Queue.name)
    private queueModel: Model<QueueDocument>,

    @InjectModel(QueueCustomer.name)
    private queueCustomer: Model<QueueCustomerDocument>,
  ) {}

  private async validCreate(
    company_id: string,
    dto: UserCreateQueueDto,
  ): Promise<void> {
    const existingQueue = await this.queueModel.findOne({
      name: dto.name,
      company_id,
    });

    if (existingQueue)
      throw new ConflictException('Você já tem uma fila com esse nome.');
  }

  public async createToCompany(
    company_id: string,
    dto: UserCreateQueueDto,
  ): Promise<QueueResponseDto> {
    await this.validCreate(company_id, dto);

    const created = await this.queueModel.create({ company_id, ...dto });

    return new QueueResponseDto(created);
  }

  public async findAllQueuesOfCompany(
    company_id: string,
  ): Promise<QueueResponseDto[]> {
    const queues = await this.queueModel.find({ company_id });
    return queues.map((queue) => new QueueResponseDto(queue));
  }

  private async findQueueByID(company_id: string, _id: string): Promise<Queue> {
    const queue = await this.queueModel.findOne({ _id, company_id });

    if (!queue) throw new NotFoundException('Fila não encontrada.');

    return queue;
  }

  public async findOneQueueOfCompany(
    company_id: string,
    _id: string,
  ): Promise<QueueResponseDto> {
    const queue = await this.findQueueByID(company_id, _id);
    return new QueueResponseDto(queue);
  }

  private async validateUpdate(
    company_id: string,
    _id: string,
    dto: UserUpdateQueueDto,
  ): Promise<void> {
    const existingQueue = await this.queueModel.findOne({
      _id: { $ne: _id },
      company_id,
      name: dto.name,
    });

    if (existingQueue) {
      throw new ConflictException('Você já tem uma fila com esse nome.');
    }
  }

  public async update(
    company_id: string,
    _id: string,
    dto: UserUpdateQueueDto,
  ): Promise<QueueResponseDto> {
    await this.validateUpdate(company_id, _id, dto);

    await this.findQueueByID(company_id, _id);

    await this.queueModel.updateOne({ _id, company_id }, dto);

    return this.findOneQueueOfCompany(company_id, _id);
  }

  public async remove(company_id: string, _id: string): Promise<void> {
    await this.findQueueByID(company_id, _id);
    await this.queueCustomer.deleteMany({ queue_id: _id });
    await this.queueModel.deleteOne({ _id });
  }
}
