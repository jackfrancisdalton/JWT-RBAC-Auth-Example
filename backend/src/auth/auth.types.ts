export type Role = 'user' | 'admin';

export interface JwtPayload {
    username: string;
    sub: string;
    roles: Role[];
  }
  
export interface User {
    id: string;
    email: string;
    password: string;
    roles: Role[];
    createdAt: Date;
}