// API客户端配置
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}

// 用户类型
export interface User {
  id: string;
  email: string;
  username: string;
  role: "student" | "teacher" | "admin";
  level: "beginner" | "intermediate" | "advanced";
  avatar?: string;
}

// 认证响应类型
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// 登录请求类型
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求类型
export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

// API客户端类
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // 从localStorage获取token
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
    }
  }

  // 设置认证token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }

  // 清除token
  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "请求失败");
      }

      return data;
    } catch (error) {
      console.error("API请求错误:", error);
      throw error;
    }
  }

  // GET请求
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // 认证相关API
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>("/auth/login", credentials);
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>("/auth/register", userData);
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.post("/auth/logout");
    this.clearToken();
    return response;
  }

  async refreshToken(): Promise<
    ApiResponse<{ token: string; refreshToken: string }>
  > {
    const refreshToken =
      typeof window !== "undefined"
        ? localStorage.getItem("refreshToken")
        : null;

    if (!refreshToken) {
      throw new Error("没有刷新令牌");
    }

    const response = await this.post<{ token: string; refreshToken: string }>(
      "/auth/refresh-token",
      { refreshToken }
    );

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
    }

    return response;
  }

  // 用户相关API
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>("/users/me");
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.put<User>("/users/profile", data);
  }

  // 词汇相关API
  async getVocabulary(): Promise<ApiResponse<any[]>> {
    return this.get<any[]>("/vocabulary");
  }

  async getVocabularyById(id: string): Promise<ApiResponse<any>> {
    return this.get<any>(`/vocabulary/${id}`);
  }

  // 学习进度相关API
  async getLearningProgress(): Promise<ApiResponse<any>> {
    return this.get<any>("/learning/progress");
  }

  async updateLearningProgress(data: any): Promise<ApiResponse<any>> {
    return this.put<any>("/learning/progress", data);
  }
}

// 创建API客户端实例
export const apiClient = new ApiClient(API_BASE_URL);

// 导出API客户端类
export default ApiClient;






