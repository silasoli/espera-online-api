import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.entity';
import { AdminCompaniesController } from './controllers/admin-companies.controller';
import { TechCompaniesController } from './controllers/tech-companies.controller';
import { AdminCompaniesService } from './services/admin-companies.service';
import { TechCompaniesService } from './services/tech-companies.service';
import { CategoriesModule } from '../categories/categories.module';
import { CustomersCompaniesController } from './controllers/customers-companies.controller';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    CategoriesModule,
  ],
  controllers: [
    AdminCompaniesController,
    TechCompaniesController,
    CustomersCompaniesController,
  ],
  providers: [AdminCompaniesService, TechCompaniesService],
  exports: [TechCompaniesService],
})
export class CompaniesModule {}
