import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload, RefreshTokenPayload, User, UserWithoutPassword } from './auth.types';
import { ExpiredRefreshToken, InvalidPasswordError, UserNotFoundError, UserWithEmailAlreadyExistsError } from './auth.errors';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {

    // For this example we're using in memory storage to avoid complicating this example with a database
    // In an actual implementation you would likley store these in a database 
    private users: User[] = [];

    constructor(private config: ConfigService, private jwtService: JwtService) {
        this.populateExampleUsers();
    }

    // Quick and easy way to add two example users to the in memory user list, not best practice, here for demonstration purposes
    private async populateExampleUsers() {
        this.users.push({ 
            id: '123', // randomUUID(), 
            email:'user@test.com', 
            password: await bcrypt.hash('password', 10), 
            roles: ['user'], 
            createdAt: new Date(),
            avatarUrl: 'https://avatar.iran.liara.run/public/25',
        })

        this.users.push({ 
            id: '345', //randomUUID(), 
            email:'admin@test.com', 
            password: await bcrypt.hash('password', 10), 
            roles: ['user', 'admin'], 
            createdAt: new Date(),
            avatarUrl: 'https://avatar.iran.liara.run/public/23',
        })
    }

    async register(email: string, password: string): Promise<AuthTokens> {
        const existing = this.users.find(user => user.email === email);
        
        if (existing)
            throw new UserWithEmailAlreadyExistsError()

        const hash = await bcrypt.hash(password, 10);
        const user: User = { 
            id: randomUUID(),
            email, 
            password: hash, 
            roles: ['user'],
            createdAt: new Date(),
            avatarUrl: null,
        };

        this.users.push(user);

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return { accessToken, refreshToken };
    }

    async login (email: string, password: string): Promise<AuthTokens> {
        const user = this.users.find(user => user.email === email);

        if(!user)
            throw new UserNotFoundError()

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            throw new InvalidPasswordError()

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return { accessToken, refreshToken };
    }


    generateAccessToken(user: User) {
        const payload: JwtPayload = { 
            username: user.email, 
            sub: user.id, 
            roles: user.roles 
        };

        return this.jwtService.sign(payload);
    }

    generateRefreshToken(user: User) {
        const payload: RefreshTokenPayload = { 
            username: user.email, 
            sub: user.id 
        };

        // For referesh token we provide a much longer time frame until expiration
        // const expiresIn = this.config.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')
        return this.jwtService.sign(payload, { expiresIn: "7d" });
    }

    verifyRefreshToken(refreshToken: string) {
        try {
            return this.jwtService.verify(refreshToken);
        } catch (e) {
            throw new ExpiredRefreshToken();
        }
    }

    // TODO: find a better solution for a user with a password being a valid return despite typing  
    fetchUserFromAccessToken(accessToken: string): UserWithoutPassword {
        const payload: JwtPayload = this.jwtService.decode(accessToken) as JwtPayload;
        const user = this.users.find(user => user.id === payload.sub);
        
        if (!user)
            throw new UserNotFoundError();

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    generateAccessTokenFromRefreshToken(refreshToken: string) {
        const refreshTokenPayload: RefreshTokenPayload = this.jwtService.decode(refreshToken);

        const user = this.users.find(user => user.id === refreshTokenPayload.sub);
        if (!user)
            throw new UserNotFoundError();

        const accessToken = this.generateAccessToken(user);

        return accessToken;
    }
}
