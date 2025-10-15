'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient, User, LoginRequest, RegisterRequest, AuthResponse } from '@/lib/api';

// 认证上下文类型
interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 检查用户是否已认证
    const isAuthenticated = !!user;

    // 初始化时检查用户状态
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // 验证token并获取用户信息
                    const response = await apiClient.getCurrentUser();
                    if (response.success && response.data) {
                        setUser(response.data);
                    } else {
                        // token无效，清除本地存储
                        apiClient.clearToken();
                    }
                }
            } catch (error) {
                console.error('初始化认证状态失败:', error);
                apiClient.clearToken();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // 登录
    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true);
            const response = await apiClient.login(credentials);

            if (response.success && response.data) {
                setUser(response.data.user);
                // 存储刷新令牌
                if (typeof window !== 'undefined') {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
            } else {
                throw new Error(response.error?.message || '登录失败');
            }
        } catch (error) {
            console.error('登录失败:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 注册
    const register = async (userData: RegisterRequest) => {
        try {
            setIsLoading(true);
            const response = await apiClient.register(userData);

            if (response.success && response.data) {
                setUser(response.data.user);
                // 存储刷新令牌
                if (typeof window !== 'undefined') {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
            } else {
                throw new Error(response.error?.message || '注册失败');
            }
        } catch (error) {
            console.error('注册失败:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 登出
    const logout = async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.error('登出失败:', error);
        } finally {
            setUser(null);
            apiClient.clearToken();
            if (typeof window !== 'undefined') {
                localStorage.removeItem('refreshToken');
            }
        }
    };

    // 刷新令牌
    const refreshToken = async () => {
        try {
            const response = await apiClient.refreshToken();
            if (response.success && response.data) {
                // 令牌刷新成功，重新获取用户信息
                const userResponse = await apiClient.getCurrentUser();
                if (userResponse.success && userResponse.data) {
                    setUser(userResponse.data);
                }
            } else {
                // 刷新失败，清除认证状态
                setUser(null);
                apiClient.clearToken();
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('refreshToken');
                }
            }
        } catch (error) {
            console.error('刷新令牌失败:', error);
            setUser(null);
            apiClient.clearToken();
            if (typeof window !== 'undefined') {
                localStorage.removeItem('refreshToken');
            }
        }
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 使用认证上下文的Hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth必须在AuthProvider内部使用');
    }
    return context;
}

export default AuthContext;














