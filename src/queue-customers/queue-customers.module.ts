import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  QueueCustomer,
  QueueCustomerSchema,
} from './schemas/queue-customer.entity';
import { QueuesModule } from '../queues/queues.module';
import { AdminQueueCustomersService } from './services/admin-queue-customers.service';
import { TechQueueCustomersService } from './services/tech-queue-customers.service';
import { QueueCustomersController } from './controllers/queue-customers.controller';
import { TechQueueCustomersController } from './controllers/tech-queue-customers.controller';
import { AdminQueueCustomersController } from './controllers/admin-queue-customers.controller';
import { QueueCustomersService } from './services/queue-customers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QueueCustomer.name, schema: QueueCustomerSchema },
    ]),
    QueuesModule,
  ],
  controllers: [
    AdminQueueCustomersController,
    QueueCustomersController,
    TechQueueCustomersController,
  ],
  providers: [
    AdminQueueCustomersService,
    TechQueueCustomersService,
    QueueCustomersService,
  ],
})
export class QueueCustomersModule {}
