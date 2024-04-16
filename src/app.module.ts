import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { RolesModule } from './roles/roles.module';
import { CompaniesModule } from './companies/companies.module';
import { QueuesModule } from './queues/queues.module';
import { QueueCustomersModule } from './queue-customers/queue-customers.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CompaniesModule,
    AuthModule,
    RolesModule,
    QueuesModule,
    QueueCustomersModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
