import { Injectable } from '@nestjs/common';
import { UserLoginDto } from '../dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { Ilogin } from '../interfaces/Ilogin.interface';
import { IloginPayload } from '../interfaces/Ipayload.interface';
import { UserLoginResponseDto } from '../dto/user-login-response.dto';
import { TechCompaniesService } from '../../companies/services/tech-companies.service';

@Injectable()
export class AuthService {
  constructor(
    private techCompaniesService: TechCompaniesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: UserLoginDto): Promise<Ilogin> {
    const user = await this.techCompaniesService.findByEmail(login.email);

    if (!user) return null;

    const passMatch = await this.techCompaniesService.comparePass(
      login.password,
      user.password,
    );

    if (!passMatch) return null;

    return { _id: user._id, name: user.name, email: user.email };
  }

  async login(user: Ilogin): Promise<IloginPayload> {
    const { _id, name, email } = user;

    const payload = { name, sub: _id };

    return new UserLoginResponseDto({
      id: _id,
      email,
      name,
      access_token: this.jwtService.sign(payload),
    })
  }

  async decodeAccessToken<T extends object>(accessToken: string): Promise<T> {
    return this.jwtService.verifyAsync(accessToken);
  }
}
