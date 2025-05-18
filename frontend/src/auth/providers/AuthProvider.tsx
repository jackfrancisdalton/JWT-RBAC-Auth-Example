import { createContext, PropsWithChildren, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthApi } from '../api/auth.api';
import axiosClient from '../helpers/axiosClient';
import { InternalAxiosRequestConfig } from 'axios';
import { AuthJwtPayload, EmailAndPassword, User, UserProfile } from '../types/auth.types';

type AuthContext = {
    token?: string | null;
    user?: User | null;
    userProfile?: UserProfile | null;
    register: (data: EmailAndPassword) => Promise<void>;
    login: (data: EmailAndPassword) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {

    // Initialise to undefined to indicate loading state (null confirms unauthenticated, undefined indicates loading)
    const [token, setToken] = useState<string | null>(undefined!);
    const [user, setUser] = useState<User | null>(undefined!);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(undefined!);

    // On component mount attempt to refresh the access token, this way we don't need to store the access token in local storage which is a security concern
    // As per: https://auth0.com/docs/secure/security-guidance/data-security/token-storage#browser-local-storage-scenarios
    useLayoutEffect(() => {
        const refreshTokenOnPageLoad = async () => {
            try {
                const res = await AuthApi.refreshAccessToken();
                setAuth(res.token);
            } catch {
                clearAuth();
            }
        }

        refreshTokenOnPageLoad();

        // Reset the state on unmount
        return () => {
            setToken(undefined!);
            setUser(undefined!);
        }
    }, [])

    // Ensure the latest access token in state is attached to all Axios requests sent
    useLayoutEffect(() => {
        const id = axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig & { _retry?: boolean }) => {
            // only run if not _retry is false, as we want to ensure the old token is not added to the request sent from the next effect
            if (token && !config._retry) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => { 
            axiosClient.interceptors.request.eject(id); 
        };
    }, [token]);


    // Attempt to refresh the access token if a request fails due to 401, and then instantly retry the previously failed request
    useLayoutEffect(() => {
        const id = axiosClient.interceptors.response.use(
            (res) => res,
            async (error) => {
                const originalRequest = error.config;

                // If the error is a 401 and the request has not already been retried, attempt to refresh the token
                if (error.response.status === 401 && !originalRequest._retry) {
                    try {
                        // Will send an empty request body as the refersh token is attached as a HTTP only cookie we can't access via Javascript
                        const res = await AuthApi.refreshAccessToken();

                        setToken(res.token);
                        originalRequest.headers['Authorization'] = `Bearer ${res.token}`;
                        originalRequest._retry = true; // custom property to ensure that we A. don't use the old token on retries with the new token, B. don't enter a loop of refreshing the token

                        return axiosClient(originalRequest);
                    } catch {
                        clearAuth();
                    }
                }
                
                return Promise.reject(error);
            }
        );

        return () => { 
            axiosClient.interceptors.response.eject(id); 
        };
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await AuthApi.getUserProfile();
                setUserProfile(res);
            } catch {
                clearAuth();
            }
        }
        fetchUserProfile();

        return () => {
            setUserProfile(undefined!);
        }
    }, [token]) // Whenever the token changes, we will want to fetch up to date user profile data


    const login = async ({email, password}: EmailAndPassword): Promise<void> => {
        try {
            const data = await AuthApi.login(email, password);
            setAuth(data.token);
        } catch(error) {
            clearAuth();
            throw error;
        }
    };

    const register = async ({email, password}: EmailAndPassword): Promise<void> => {
        try {
            const data = await AuthApi.register(email, password);
            setAuth(data.token);
        } catch(error) {
            clearAuth();
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        clearAuth();
    }

    const setAuth = (token: string) => {
        const tokenData = jwtDecode<AuthJwtPayload>(token);
        const user: User = { email: tokenData.username, roles: tokenData.roles };

        setToken(token);
        setUser(user);
    }

    const clearAuth = async () => {
        await AuthApi.logout();
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ 
            token, 
            user, 
            userProfile,
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
