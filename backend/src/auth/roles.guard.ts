import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtPayload, Role } from './auth.types';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Get the roles specified on the route by the @Roles() decorator.
    const requiredRoles = this.reflector.get<Role[]>('requiredRoles', context.getHandler());
    
    // If no roles are specified, allow access to the route
    if (!requiredRoles || requiredRoles.length === 0)
      return true;
    
    /*
     * Clarification (inner workings are not intuitive):
     * - super.canActivate calls canActivate on AuthGuard
     * - AuthGuard extracts the JWT token and verifies the signiture, expiration, and overal validity 
     * - it then checks does an additional validation using JWTSTrategy.validate()
     * - if everything validates then canActivate returns true
     * - The payload returned from JWTStrategy.validate() is then attached to the request object as "user"
     */
    const isAuthenticated = (await super.canActivate(context)) as boolean;

    if (!isAuthenticated)
      return false;
    
    const request = context.switchToHttp().getRequest();
    const jwtPayload: JwtPayload = request.user; // the payload is attached as request.user by the default AuthGuard behaviour
    
    // If all required roles are present in the user object, return true
    return requiredRoles.every(role =>
      jwtPayload.roles && jwtPayload.roles.includes(role),
    );
  }
}