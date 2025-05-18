import { JwtPayload } from "jwt-decode";

export type UserRole = 'user' | 'admin';

export interface AuthJwtPayload extends JwtPayload {
    username: string;
    roles: UserRole[];
}

export type User = {
    email: string;
    roles: UserRole[];
}

export interface EmailAndPassword {
    email: string;
    password: string;
}

export type UserProfile = {
    id: string;
    email: string;
    roles: string[];
    createdAt: string;
    avatarUrl: string | null;
}