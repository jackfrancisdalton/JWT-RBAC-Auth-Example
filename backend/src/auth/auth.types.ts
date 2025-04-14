export type Role = 'user' | 'admin';

export interface JwtPayload {
    username: string; // users's email
    sub: string; // user's id
    roles: Role[]; // users roles
}

export interface User {
    id: string;
    email: string;
    password: string;
    roles: Role[];
    createdAt: Date;
}