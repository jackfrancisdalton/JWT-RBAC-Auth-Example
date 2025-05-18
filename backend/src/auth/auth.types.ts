export type Role = 'user' | 'admin';

export interface JwtPayload {
    username: string; // users's email
    sub: string; // user's id
    roles: Role[]; // users roles
}

export interface RefreshTokenPayload {
    username: string;
    sub: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    roles: Role[];
    createdAt: Date;
    avatarUrl: string | null;
}

export type UserProfile = {
    id: string;
    email: string;
    roles: string[];
    createdAt: Date;
    avatarUrl: string | null;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

