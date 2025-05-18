import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InvalidPasswordError, UserNotFoundError, UserWithEmailAlreadyExistsError } from './auth.errors';
import { Request, Response } from 'express';
import { RefreshTokenGuard } from './refreshtoken.guard';
import { CookieNames } from './auth.constants';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './auth.types';

interface AuthRequestBody {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: AuthRequestBody, @Res() res: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.register(body.email, body.password);

            // Set the refresh token as an HTTP-only cookie
            res.cookie(CookieNames.REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
                httpOnly: true,  // No Javascript can ever read the cookie keeping it safe!
                secure: false,  // NOTE: as we're local we use http, but this should always ideally by HTTPS only (secure: true)
                maxAge: 7 * 24 * 60 * 60 * 1000,  // TODO: pair this up with an environment variable so it  matches the refresh token expiration
            });

            return res.json({ token: accessToken });
        } catch (error) {
            if (error instanceof UserWithEmailAlreadyExistsError)
                throw new HttpException(error.message, error.httpStatusCode);

            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() body: AuthRequestBody, @Res() res: Response) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(body.email, body.password);

            res.cookie(CookieNames.REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
                httpOnly: true,  
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ token: accessToken });
        } catch (error) {
            if (error instanceof UserNotFoundError || error instanceof InvalidPasswordError)
                throw new HttpException(error.message, error.httpStatusCode);
            
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        res.clearCookie(CookieNames.REFRESH_TOKEN_COOKIE_KEY, {
            httpOnly: true,
            secure: false,
            maxAge: 0,
        });
        return res.json({ message: 'Logged out successfully' });
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refresh(@Req() req: Request, @Res() res: Response) {
        // We can assume a valid refresh token in this code as the RefreshTokenGuard covers that responsability
        const refreshToken = req.cookies[CookieNames.REFRESH_TOKEN_COOKIE_KEY];
        const accessToken = await this.authService.generateAccessTokenFromRefreshToken(refreshToken);
        return res.json({ token: accessToken });
    }

    @Get('me')
    @UseGuards(RefreshTokenGuard)
    async me(@Req() req: Request, @Res() res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new HttpException('Authorization header missing or malformed', HttpStatus.UNAUTHORIZED);
        }

        const token = authHeader.split(' ')[1];
        const userProfile = this.authService.fetchUserFromAccessToken(token);
        return res.json(userProfile);
    }
}
