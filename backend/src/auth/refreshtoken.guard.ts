import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Console } from 'console';

@Injectable()
export class RefreshTokenGuard implements CanActivate {

  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
        throw new ForbiddenException('No refresh token provided');
    }

    try {
        await this.authService.verifyRefreshToken(refreshToken);
    } catch {
        throw new ForbiddenException('Invalid or expired refresh token');
    }

    return true;
  }
}