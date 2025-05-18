import { AxiosResponse } from "axios";
import axiosClient from "../helpers/axiosClient";
import { UserProfile } from "../types/auth.types";

interface TokenResponse {
    token: string
}

const login = async (email: string, password: string): Promise<TokenResponse> => {
    const res = await axiosClient.post('/auth/login', { email, password });
    return await handleResponse<TokenResponse>(res);
};

const register = async (email: string, password: string): Promise<TokenResponse> => {
    const res = await axiosClient.post('/auth/register', { email, password });
    return await handleResponse<TokenResponse>(res);
};

const refreshAccessToken = async (): Promise<TokenResponse> => {
    const response = await axiosClient.post('/auth/refresh', {});
    const res = await handleResponse<TokenResponse>(response);
    return res;
}

const getUserProfile = async (): Promise<UserProfile> => {
    const response = await axiosClient.get('/auth/me', {});
    const res = await handleResponse<UserProfile>(response);
    return res;
}


const handleResponse = async <T>(res: AxiosResponse): Promise<T> => {
    if (res.status < 200 || res.status >= 300) {
        throw new Error(res.data?.message || 'An unknown error occurred');
    }
    return res.data;
};

const logout = async (): Promise<void> => {
    return await axiosClient.get('/auth/logout');
}

export const AuthApi = {
    login,
    logout,
    register,
    getUserProfile,
    refreshAccessToken
};
