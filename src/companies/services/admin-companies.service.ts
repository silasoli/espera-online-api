import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { join } from 'path';
import * as fs from 'fs';
import { Company, CompanyDocument } from '../schemas/company.entity';
import { ProfileCompanyResponseDto } from '../dto/profile-company-response.dto';
import { UpdateProfileCompanyDto } from '../dto/update-profile-company.dto';
import { DeleteCompanyDto } from '../dto/delete-company.dto';
import { UploadCompanyPictureDto } from '../dto/upload-company-picture.dto';
import { TechCompaniesService } from './tech-companies.service';

@Injectable()
export class AdminCompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
    private techCompaniesService: TechCompaniesService,
  ) {}

  public async findProfile(_id: string): Promise<ProfileCompanyResponseDto> {
    const user = await this.companyModel
      .findOne({ _id })
      .populate({ path: 'category_id' });
    return new ProfileCompanyResponseDto(user);
  }

  public async updateProfile(
    _id: string,
    dto: UpdateProfileCompanyDto,
  ): Promise<ProfileCompanyResponseDto> {
    await this.companyModel.updateOne({ _id }, dto);

    return this.findProfile(_id);
  }

  public async deleteUser(_id: string, dto: DeleteCompanyDto): Promise<void> {
    const user = await this.companyModel.findOne({ _id }, ['+password']);

    const passMatch = await this.techCompaniesService.comparePass(
      dto.password,
      user.password,
    );

    if (!passMatch) throw new UnauthorizedException('Senha incorreta.');

    await this.companyModel.deleteOne({ _id });
  }

  private async getProfilePictureURL(_id: string): Promise<string | null> {
    const picture = await this.companyModel.findOne({ _id }, ['logo_url']);
    return picture.logo_url;
  }

  private deleteProfilePicture(url: string) {
    const profilePicturePath = join(
      process.cwd(),
      'uploads/profile-picture/',
      url,
    );

    fs.unlink(profilePicturePath, (err) => {
      if (err) console.error(`Error deleting profile picture: ${err}`);
    });
  }

  public async updateProfilePicture(
    _id: string,
    dto: UploadCompanyPictureDto,
  ): Promise<string | null> {
    const profilePicture = await this.getProfilePictureURL(_id);

    if (profilePicture) this.deleteProfilePicture(profilePicture);

    await this.companyModel.updateOne(
      { _id },
      { profile_picture: dto.file.filename ? dto.file.filename : null },
    );

    return this.getProfilePictureURL(_id);
  }

  public async getProfilePicture(_id: string): Promise<string> {
    const user = await this.companyModel.findOne({ _id });

    const profilePicture = user.logo_url ? user.logo_url : 'default-image.png';

    return join(process.cwd(), 'uploads/profile-picture/' + profilePicture);
  }
}
