import { Module } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { AdminCategoriesController } from './controllers/admin-categories.controller';
import { TechCategoriesController } from './controllers/tech-categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas/category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [AdminCategoriesController, TechCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
