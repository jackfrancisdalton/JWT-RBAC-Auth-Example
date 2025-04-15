const AUTH_URL_BASE = 'http://localhost:3000/auth'; // TODO: update to use enviornment variable

const login = async (email: string, password: string): Promise<{ token: string }> => {
    const res = await fetch(`${AUTH_URL_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    
    return await handleResponse(res);
};

const register = async (email: string, password: string): Promise<{ token: string }> => {
    const res = await fetch(`${AUTH_URL_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    return await handleResponse(res);
};

const handleResponse = async (res: Response): Promise<any> => {
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'An unknown error occurred');
    }
    return res.json();
};

export const AuthApi = {
    login,
    register,
};
