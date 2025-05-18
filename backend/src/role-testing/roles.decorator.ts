import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/auth/auth.types';

// Note that we make use of the Role type to ensure only valid roles can be enetered when the decorator is used
export const Roles = (...requiredRoles: Role[]) => SetMetadata('requiredRoles', requiredRoles);