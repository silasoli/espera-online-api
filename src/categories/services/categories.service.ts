import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from '../schemas/category.entity';
import { Model } from 'mongoose';
import { CategoryResponseDto } from '../dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  private createSlugByName(name: string): string {
    const lowerCaseName = name.toLowerCase();

    const slug = lowerCaseName.replace(/\s+/g, '_');

    return slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  public async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const slug = this.createSlugByName(dto.name);

    const created = await this.categoryModel.create({ ...dto, slug });

    return new CategoryResponseDto(created);
  }

  public async getCategoriesByName(
    name: string,
  ): Promise<CategoryResponseDto[]> {
    return this.categoryModel.find({
      name: {
        $regex: `.*${name.toLowerCase()}.*`,
        $options: 'i',
      },
    });
  }

  public async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryModel.find();

    return categories.map((user) => new CategoryResponseDto(user));
  }

  private async findCategoryByID(_id: string): Promise<Category> {
    const category = await this.categoryModel.findById(_id);

    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }

  public async findOne(_id: string): Promise<CategoryResponseDto> {
    const category = await this.findCategoryByID(_id);

    return new CategoryResponseDto(category);
  }

  public async update(
    _id: string,
    dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    await this.findCategoryByID(_id);

    const slug = this.createSlugByName(dto.name);

    await this.categoryModel.updateOne({ _id }, { ...dto, slug });

    return this.findOne(_id);
  }
}
