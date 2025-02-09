import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthUserJwtStrategy } from './strategies/auth-user-jwt.strategy';
import { Company, CompanySchema } from '../companies/schemas/company.entity';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('USER_SECRET');
        const expiresIn = configService.get<string>('USER_EXPIRESIN');
        return {
          secret,
          signOptions: { expiresIn: expiresIn || '1d' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUserJwtStrategy],
})
export class AuthModule {}
