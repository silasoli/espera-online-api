import { Injectable, NotFoundException } from '@nestjs/common';
import { Company, CompanyDocument } from '../schemas/company.entity';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import Role from '../../roles/enums/role.enum';
import { CreateCompanyDto } from '../dto/company-user.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CompanyQueryDto } from '../dto/company-query.dto';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class TechCompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,

    private readonly categoriesService: CategoriesService,
  ) {}

  private async transformBody(dto: CreateCompanyDto | UpdateCompanyDto) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 12);
  }

  public async findByEmail(email: string): Promise<Company> {
    return this.companyModel.findOne({ email: email.toLowerCase() }, [
      '+password',
    ]);
  }

  public async findByName(username: string): Promise<Company> {
    return this.companyModel.findOne({ username: username.toLowerCase() });
  }

  public async create(dto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const rawData = { ...dto, roles: [Role.ADMIN] };

    await this.transformBody(rawData);

    const created = await this.companyModel.create(rawData);

    return new CompanyResponseDto(created);
  }

  private async filterCategoriesByName(name: string): Promise<string[]> {
    const categories = await this.categoriesService.getCategoriesByName(name);

    return categories?.map((category) => category._id);
  }

  public async findAll(query: CompanyQueryDto): Promise<CompanyResponseDto[]> {
    const filters: FilterQuery<Company> = {};

    if (query.category) {
      const categoryIds = await this.filterCategoriesByName(query.category);
      filters.category_id = { $in: categoryIds };
    }

    const companies = await this.companyModel.find(filters).populate({
      path: 'category_id',
    });

    return companies.map((company) => new CompanyResponseDto(company));
  }

  private async findUserByID(_id: string): Promise<Company> {
    const company = await this.companyModel
      .findById(_id)
      .populate({ path: 'category_id' });

    if (!company) throw new NotFoundException('Empresa não encontrada');

    return company;
  }

  public async findOne(_id: string): Promise<CompanyResponseDto> {
    const user = await this.findUserByID(_id);
    
    return new CompanyResponseDto(user);
  }

  public async findRolesOfUser(_id: string): Promise<Role[]> {
    const user = await this.companyModel.findOne({ _id }, ['roles']);

    if (!user) throw new NotFoundException('Empresa não encontrada');

    return user.roles;
  }

  public async update(
    _id: string,
    dto: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    await this.findUserByID(_id);

    const rawData = { ...dto };

    await this.transformBody(rawData);

    await this.companyModel.updateOne({ _id }, rawData);

    return this.findOne(_id);
  }

  public async remove(_id: string): Promise<void> {
    await this.findUserByID(_id);
    await this.companyModel.deleteOne({ _id });
  }

  public async comparePass(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
