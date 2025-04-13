import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

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
  const [token, setToken] = useState<string | null>();
  const [user, setUser] = useState<User | null>()

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

        setToken(data.token);
        setUser({
            id: tokenData.sub,
            email: tokenData.username,
            roles: tokenData.roles
        } as User);
    } catch {
        setToken(null);
        setUser(null);
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

        setToken(data.token);
        setUser({
            id: tokenData.sub,
            email: tokenData.username,
            roles: tokenData.roles
        } as User);
    } catch {
        setToken(null);
        setUser(null);
    }
  };

  const logout = async (): Promise<void> => {
    setToken(null);
    setUser(null);
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
