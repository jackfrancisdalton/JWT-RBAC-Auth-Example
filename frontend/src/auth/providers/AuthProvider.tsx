import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

const localStorageKeys = {
    USER: 'user',
    TOKEN: 'token'
}

// TODO: clean up types/interfaces and move to dedicated file
export type Role = 'user' | 'admin';

interface AuthJwtPayload extends JwtPayload {
    username: string;
    roles: Role[];
}

export type User = {
    email: string;
    roles: Role[];
}

interface UserNameAndPassword {
    email: string;
    password: string;
}

type AuthContext = {
    token?: string | null;
    user?: User | null;
    register: (data: UserNameAndPassword) => Promise<void>;
    login: (data: UserNameAndPassword) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(localStorageKeys.TOKEN));
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem(localStorageKeys.USER);
        return storedUser ? JSON.parse(storedUser) : null;
    });

  // TODO: Add call for authentication load     

  const login = async ({email, password}: UserNameAndPassword): Promise<void> => {
    try {
        // TODO: move into dedicated api file
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        const tokenData = jwtDecode<AuthJwtPayload>(data.token);
        setAuth(data.token, { email: tokenData.username, roles: tokenData.roles });
    } catch {
        clearAuth();
    }
  };

    const register = async ({email, password}: UserNameAndPassword): Promise<void> => {
        try {
            // TODO: move into dedicated api file
            const res = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            const tokenData = jwtDecode<AuthJwtPayload>(data.token);
            setAuth(data.token, { email: tokenData.username, roles: tokenData.roles });
        } catch {
            clearAuth();
        }
    };

    const logout = async (): Promise<void> => {
        clearAuth();
    }

    const setAuth = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem(localStorageKeys.TOKEN, token);
        localStorage.setItem(localStorageKeys.USER, JSON.stringify(user));
    }

    const clearAuth = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(localStorageKeys.TOKEN);
        localStorage.removeItem(localStorageKeys.USER);
    }

    return (
        <AuthContext.Provider value={{ 
            token, 
            user, 
            register, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => { 
    const context = useContext(AuthContext);

    if (context === undefined)
        throw new Error('useAuth must be used within an AuthProvider');

    return context;
}
