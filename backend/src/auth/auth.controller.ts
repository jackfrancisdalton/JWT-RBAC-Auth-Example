import { Body, Controller, Get, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { InvalidPasswordError, UserNotFoundError, UserWithEmailAlreadyExistsError } from './auth.errors';

interface AuthRequestBody {
    email: string;
    password: string;
}

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: AuthRequestBody) {
        try {
            const token = await this.authService.register(body.email, body.password);
            return { token };
        } catch (error) {
            if (error instanceof UserWithEmailAlreadyExistsError)
                throw new HttpException(error.message, error.httpStatusCode);

            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() body: AuthRequestBody) {
        try {
            const token = await this.authService.login(body.email, body.password);
            return { token };
        } catch (error) {
            if (error instanceof UserNotFoundError || error instanceof InvalidPasswordError)
                throw new HttpException(error.message, error.httpStatusCode);
            
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
