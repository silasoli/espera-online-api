import { Injectable } from '@nestjs/common';
import Role from '../enums/role.enum';
import { TechCompaniesService } from '../../companies/services/tech-companies.service';

@Injectable()
export class RoleUtil {
  constructor(private readonly techCompaniesService: TechCompaniesService) {}

  public async userHasRole(
    userid: string,
    requiredRoles: Role[],
  ): Promise<boolean> {
    const userRoles = await this.techCompaniesService.findRolesOfUser(userid);

    if (!userRoles) return false;

    return this.roleHasAction(userRoles, requiredRoles);
  }

  public roleHasAction(roles: Role[], requiredRoles: Role[]): boolean {
    for (const role of requiredRoles) {
      if (roles.includes(role)) return true;
    }
    return false;
  }
}
