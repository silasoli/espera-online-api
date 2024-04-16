import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue, QueueSchema } from './schemas/queue.entity';
import { TechQueuesController } from './controllers/tech-queues.controller';
import { AdminQueuesController } from './controllers/admin-queues.controller';
import { AdminQueuesService } from './services/admin-queues.service';
import { TechQueuesService } from './services/tech-queues.service';
import {
  QueueCustomer,
  QueueCustomerSchema,
} from '../queue-customers/schemas/queue-customer.entity';
import { CustomersQueuesController } from './controllers/customers-queues.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Queue.name, schema: QueueSchema },
      { name: QueueCustomer.name, schema: QueueCustomerSchema },
    ]),
  ],
  controllers: [
    AdminQueuesController,
    TechQueuesController,
    CustomersQueuesController,
  ],
  providers: [AdminQueuesService, TechQueuesService],
  exports: [TechQueuesService],
})
export class QueuesModule {}
