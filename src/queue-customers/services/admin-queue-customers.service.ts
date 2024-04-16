import { Injectable, NotFoundException } from '@nestjs/common';
import {
  QueueCustomer,
  QueueCustomerDocument,
} from '../schemas/queue-customer.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQueueCustomerDto } from '../dto/create-queue-customer.dto';
import { QueueCustomerResponseDto } from '../dto/queue-customer-response.dto';
import { TechQueuesService } from '../../queues/services/tech-queues.service';
import { SwapQueueCustomersDto } from '../dto/swap-queue-customer.dto';
import * as crypto from 'crypto';
import { MoveQueueCustomersDto } from '../dto/move-queue-customer.dto';

@Injectable()
export class AdminQueueCustomersService {
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
    company_id: string,
    queue_id: string,
    dto: CreateQueueCustomerDto,
  ): Promise<QueueCustomerResponseDto> {
    const queue = await this.techQueuesService.findQueueByIDAndCompany(
      queue_id,
      company_id,
    );

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
    const customer = await this.queueCustomerModel.findOne({
      queue_id,
      _id: customer_id,
    });

    if (!customer) throw new NotFoundException('Pessoa não encontrada.');

    return customer;
  }

  public async findAll(
    company_id: string,
    queue_id: string,
  ): Promise<QueueCustomerResponseDto[]> {
    await this.techQueuesService.findQueueByIDAndCompany(queue_id, company_id);

    const queueCustomers = await this.queueCustomerModel
      .find({
        queue_id,
      })
      .sort({ position: 'asc' });

    return queueCustomers.map(
      (customers) => new QueueCustomerResponseDto(customers),
    );
  }

  public async findOne(
    company_id: string,
    queue_id: string,
    customer_id: string,
  ): Promise<QueueCustomerResponseDto> {
    const queue = await this.techQueuesService.findQueueByIDAndCompany(
      queue_id,
      company_id,
    );

    const queueCustomer = await this.findQueueCustomerByID(
      queue_id,
      customer_id,
    );

    return new QueueCustomerResponseDto(queueCustomer, queue.averageWaitTime);
  }

  public async findOneByCode(
    company_id: string,
    queue_id: string,
    code: string,
  ): Promise<QueueCustomerResponseDto> {
    const queue = await this.techQueuesService.findQueueByIDAndCompany(
      queue_id,
      company_id,
    );

    const queueCustomer = await this.queueCustomerModel.findOne({
      queue_id,
      code,
    });

    if (!queueCustomer) throw new NotFoundException('Código inválido');

    return new QueueCustomerResponseDto(queueCustomer, queue.averageWaitTime);
  }

  public async remove(
    company_id: string,
    queue_id: string,
    customer_id: string,
  ) {
    await this.techQueuesService.findQueueByIDAndCompany(queue_id, company_id);

    const customer = await this.findQueueCustomerByID(queue_id, customer_id);

    const session = await this.queueCustomerModel.startSession();
    session.startTransaction();

    try {
      const customersToUpdate = await this.queueCustomerModel
        .find({
          queue_id,
          position: { $gt: customer.position },
        })
        .session(session);

      const updates = customersToUpdate.map((customer) => ({
        updateOne: {
          filter: { _id: customer._id },
          update: { $set: { position: customer.position - 1 } },
        },
      }));

      await this.queueCustomerModel.bulkWrite(updates, { session });

      await this.queueCustomerModel.deleteOne(
        {
          queue_id,
          _id: customer_id,
        },
        { session },
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  public async swapPositions(
    company_id: string,
    queue_id: string,
    dto: SwapQueueCustomersDto,
  ): Promise<QueueCustomerResponseDto[]> {
    const { firstPerson_id, secondPerson_id } = dto;
    await this.techQueuesService.findQueueByIDAndCompany(queue_id, company_id);

    const firstPerson = await this.findQueueCustomerByID(
      queue_id,
      firstPerson_id,
    );
    const secondPerson = await this.findQueueCustomerByID(
      queue_id,
      secondPerson_id,
    );

    await this.queueCustomerModel.updateOne(
      { _id: firstPerson_id },
      { position: secondPerson.position },
    );

    await this.queueCustomerModel.updateOne(
      { _id: secondPerson_id },
      { position: firstPerson.position },
    );

    return this.findAll(company_id, queue_id);
  }

  public async moveCustomers(
    queue_id: string,
    dto: MoveQueueCustomersDto,
  ): Promise<void> {
    await this.techQueuesService.findOne(queue_id);

    const updates = dto.queueCustomers.map(({ _id, position }) => ({
      updateOne: {
        filter: {
          _id,
          queue_id: { _id: new mongoose.Types.ObjectId(queue_id) },
        },
        update: { $set: { position } },
      },
    }));

    await this.queueCustomerModel.bulkWrite(updates);
  }
}
