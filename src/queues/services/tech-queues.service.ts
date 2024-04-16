import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminCreateQueueDto } from '../dto/admin-create-queue.dto';
import { AdminUpdateQueueDto } from '../dto/admin-update-queue.dto';
import { Queue, QueueDocument } from '../schemas/queue.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueueResponseDto } from '../dto/queue-response.dto';
import {
  QueueCustomer,
  QueueCustomerDocument,
} from '../../queue-customers/schemas/queue-customer.entity';

@Injectable()
export class TechQueuesService {
  constructor(
    @InjectModel(Queue.name)
    private queueModel: Model<QueueDocument>,

    @InjectModel(QueueCustomer.name)
    private queueCustomer: Model<QueueCustomerDocument>,
  ) {}

  private async validCreate(dto: AdminCreateQueueDto): Promise<void> {
    const existingQueue = await this.queueModel.findOne({
      name: dto.name,
      company_id: dto.company_id,
    });

    if (existingQueue)
      throw new ConflictException(
        'Esse usuário já tem uma fila com esse nome.',
      );
  }

  public async create(dto: AdminCreateQueueDto): Promise<QueueResponseDto> {
    await this.validCreate(dto);

    const created = await this.queueModel.create(dto);

    return new QueueResponseDto(created);
  }

  public async findAll(): Promise<QueueResponseDto[]> {
    const queues = await this.queueModel.find();
    return queues.map((queue) => new QueueResponseDto(queue));
  }

  public async findQueuesByCompany(
    company_id: string,
  ): Promise<QueueResponseDto[]> {
    const queues = await this.queueModel.find({ company_id });

    return queues.map((queue) => new QueueResponseDto(queue));
  }

  public async findQueueByIDAndCompany(
    _id: string,
    company_id: string,
  ): Promise<Queue> {
    const queue = await this.queueModel.findOne({ _id, company_id });

    if (!queue) throw new NotFoundException('Fila não encontrada.');

    return queue;
  }

  private async findQueueByID(_id: string): Promise<Queue> {
    const queue = await this.queueModel.findById(_id);

    if (!queue) throw new NotFoundException('Fila não encontrada.');

    return queue;
  }

  public async findOne(_id: string): Promise<QueueResponseDto> {
    const queue = await this.findQueueByID(_id);
    return new QueueResponseDto(queue);
  }

  private async validateUpdate(
    _id: string,
    dto: AdminUpdateQueueDto,
  ): Promise<void> {
    const existingQueue = await this.queueModel.findOne({
      _id: { $ne: _id },
      company_id: dto.company_id,
      name: dto.name,
    });

    if (existingQueue) {
      throw new ConflictException(
        'Esse usuário já tem uma fila com esse nome.',
      );
    }
  }

  public async update(
    _id: string,
    dto: AdminUpdateQueueDto,
  ): Promise<QueueResponseDto> {
    await this.validateUpdate(_id, dto);

    await this.findQueueByID(_id);

    await this.queueModel.updateOne({ _id }, dto);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findQueueByID(_id);
    await this.queueCustomer.deleteMany({ queue_id: _id });
    await this.queueModel.deleteOne({ _id });
  }
}
