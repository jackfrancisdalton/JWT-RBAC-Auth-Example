import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { InvalidPasswordError, UserNotFoundError, UserWithEmailAlreadyExistsError } from './auth.errors';
import { AuthGuard } from '@nestjs/passport';

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
    
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Automatically triggers Google OAuth flow which will redirect to Google login page and then hit the authRedirect on success
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        // We have a user on the req here because the callback in the react app passed a bearer and the auth guard attached the user based on this token as user
        return this.authService.googleLogin(req.user);
    }

    // TODO: move these to a role check controller
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
