// homework/src/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../user/user.model';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
