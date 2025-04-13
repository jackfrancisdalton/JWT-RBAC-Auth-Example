const AUTH_URL_BASE = 'http://localhost:3000/auth';

const login = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        const res = await fetch(`${AUTH_URL_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error(`Login failed with status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        throw new Error(`An error occurred during login: ${error instanceof Error ? error.message : error}`);
    }
};

const register = async (email: string, password: string): Promise<{ token: string }> => {
    try {
        const res = await fetch(`${AUTH_URL_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            throw new Error(`Registration failed with status: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        throw new Error(`An error occurred during registration: ${error instanceof Error ? error.message : error}`);
    }
};

export const AuthApi = {
    login,
    register,
};
