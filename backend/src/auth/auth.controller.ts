import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface AuthBody {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: AuthBody) {
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: AuthBody) {
        return this.authService.login(body.email, body.password);
    }
}
