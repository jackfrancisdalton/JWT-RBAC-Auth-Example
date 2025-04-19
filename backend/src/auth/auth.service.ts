import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { JwtPayload, User } from './auth.types';
import { InvalidPasswordError, UserNotFoundError, UserWithEmailAlreadyExistsError } from './auth.errors';


// TODO clean up: move to a dedicated file with relevant types later
type GoogleLoginResponse = { 
    id: string;
    email: string;
    name: string;
    // TODO:
}

@Injectable()
export class AuthService {

    // For this example we're using in memory storage to avoid complicating this example with a database
    // In an actual implementation you would likley store these in a database 
    private users: User[] = [];

    constructor(private jwtService: JwtService) {
        this.populateExampleUsers();
    }

    // Quick and easy way to add two example users to the in memory user list, not best practice, here for demonstration purposes
    private async populateExampleUsers() {
        this.users.push({ 
            id: Date.now().toString(36) + Math.random().toString(36).slice(0, 2), 
            email:'user@test.com', 
            password: await bcrypt.hash('password', 10), 
            roles: ['user'], 
            createdAt: new Date(),
            authProvider: 'internal'
        })

        this.users.push({ 
            id: Date.now().toString(36) + Math.random().toString(36).slice(0, 2), 
            email:'admin@test.com', 
            password: await bcrypt.hash('password', 10), 
            roles: ['user', 'admin'], 
            createdAt: new Date(),
            authProvider: 'internal'
        })
    }

    async register(email: string, password: string): Promise<string> {
        const existing = this.users.find(user => user.email === email);
        
        if (existing)
            throw new UserWithEmailAlreadyExistsError()

        const hash = await bcrypt.hash(password, 10);
        const user: User = { 
            id: Date.now().toString(36) + Math.random().toString(36).slice(0, 2),
            email, 
            password: hash, 
            roles: ['user'],
            createdAt: new Date(),
            authProvider: 'internal'
        };

        this.users.push(user);

        return this.generateJwt(user);
    }

    async login (email: string, password: string): Promise<string> {
        const user = this.users
            .filter(user => user.authProvider === 'internal') // we only allow login in this method for internal users, others will have to use other login methods like google login
            .find(user => user.email === email);

        if(!user)
            throw new UserNotFoundError()

        const valid = await bcrypt.compare(password, user.password);

        if (!valid)
            throw new InvalidPasswordError()

        return this.generateJwt(user);
    }

    async googleLogin(user: GoogleLoginResponse): Promise<{ access_token: string }> {
        const existingUser = this.users.find(existing => existing.email === user.email);
    
        if (!existingUser) {
            const newUserFromGoogle: User = { 
                id: user.id,
                email: user.email, 
                roles: ['user'], 
                createdAt: new Date(),
                password: '',
                authProvider: 'google'
            };

            this.users.push(newUserFromGoogle);

            return { 
                access_token: await this.generateJwt(newUserFromGoogle) 
            };
        }
    
        return { access_token: await this.generateJwt(existingUser) };
    }

    async generateJwt(user: User): Promise<string> {
        // Here we assign the userId to the sub property of the JWT payload as per the JWT standard
        const payload: JwtPayload = { 
            username: user.email, 
            sub: user.id, 
            roles: user.roles 
        };

        return this.jwtService.sign(payload);
    }
}
