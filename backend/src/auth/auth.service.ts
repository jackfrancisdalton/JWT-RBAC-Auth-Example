import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload, User } from './auth.types';

@Injectable()
export class AuthService {
    // For this example we're using in memory storage to avoid getting complicating this example with a database
    // In an actual implementation you would likley store these in a database 
    private users: User[] = [];

    constructor(private jwtService: JwtService) {}

    async register(email: string, password: string): Promise<string> {
        const existing = this.users.find(user => user.email === email);
        
        if (existing)
            throw new Error('User already exists');

        const hash = await bcrypt.hash(password, 10);
        const user: User = { 
            id: Date.now().toString(36) + Math.random().toString(36).slice(0, 2),
            email, 
            password: hash, 
            roles: ['user'],
            createdAt: new Date(),
        };

        this.users.push(user);

        return this.generateJwt(user);
    }

    async login (email: string, password: string): Promise<string> {
        const user = this.users.find(user => user.email === email);

        if(!user)
            throw new Error('User not found');

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            throw new Error('Invalid password');

        return this.generateJwt(user);
    }

    async generateJwt(user: User): Promise<string> {
        const payload: JwtPayload = { username: user.email, sub: user.id, roles: user.roles };
        return this.jwtService.sign(payload);
    }
}
