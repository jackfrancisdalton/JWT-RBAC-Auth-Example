import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

interface AuthBody {
    email: string;
    password: string;
}

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: AuthBody) {
        const token = this.authService.register(body.email, body.password);
        return { token }
    }

    @Post('login')
    async login(@Body() body: AuthBody) {
        const token = await this.authService.login(body.email, body.password);
        return { token };
    }

    @Get('adminRoleCheck')
    @Roles('admin')
    async adminRoleCheck() {
        return { message: "Success! You have the admin role!" };
    }

    @Get('userRoleCheck')
    @Roles('user')
    async userRoleCheck() {
        return { message: "Success! You have the user role!" };
    }
}
