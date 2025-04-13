import { createContext, PropsWithChildren, useContext, useState } from 'react';

type User = {
    id: string;
    email: string;
    roles: string[];
    createdAt: Date;
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

  const login = async ({email, password}: UserNameAndPassword): Promise<void> => {
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        setToken(data.access_token);
        setUser(data.user);
    } catch {
        setToken(null);
        setUser(null);
    }
  };

  const register = async ({email, password}: UserNameAndPassword): Promise<void> => {
    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        setToken(data.access_token);
        setUser(data.user);
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