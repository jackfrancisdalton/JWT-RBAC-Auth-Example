import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { AuthStrategyNames } from 'src/auth/auth.constants';
import { JwtPayload, Role } from 'src/auth/auth.types';

@Injectable()
export class RolesGuard extends AuthGuard(AuthStrategyNames.JWT) {
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
     * Clarification of how this works (inner workings are not intuitive):
     * - super.canActivate calls canActivate on AuthGuard
     * - AuthGuard extracts the JWT token from the request and verifies the signiture, expiration, and overal validity 
     * - it then runs validation via the JWTSTrategy.validate()
     * - if everything validates then canActivate returns true
     * - The payload returned from JWTStrategy.validate() is also attached to the request object as "user"
     */

    const isAuthenticated = (await super.canActivate(context)) as boolean;
    
    if (!isAuthenticated) {
      return false;
    }
    
    const request = context.switchToHttp().getRequest();
    const jwtPayload: JwtPayload = request.user; // the payload is attached as request.user by the default AuthGuard behaviour
    
    // If all required roles are present in the user object, allow access!
    return requiredRoles.every(role => jwtPayload.roles && jwtPayload.roles.includes(role));
  }
}