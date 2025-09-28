'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('登出失败:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 导航栏 */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                学位英语学习平台
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                欢迎，{user?.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                登出
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 主要内容 */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                欢迎来到学位英语学习平台！
                            </h2>
                            <p className="text-gray-600 mb-6">
                                您已成功登录，可以开始您的英语学习之旅了。
                            </p>

                            {/* 用户信息卡片 */}
                            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">用户信息</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">用户名:</span>
                                        <span className="text-gray-900">{user?.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">邮箱:</span>
                                        <span className="text-gray-900">{user?.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">角色:</span>
                                        <span className="text-gray-900">
                                            {user?.role === 'admin' ? '管理员' :
                                                user?.role === 'teacher' ? '教师' : '学生'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">等级:</span>
                                        <span className="text-gray-900">
                                            {user?.level === 'beginner' ? '初级' :
                                                user?.level === 'intermediate' ? '中级' : '高级'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 功能模块 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">词汇学习</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        系统学习学位英语核心词汇
                                    </p>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm">
                                        开始学习
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">语法练习</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        掌握英语语法要点和规则
                                    </p>
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm">
                                        开始练习
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">阅读理解</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        提升英语阅读理解能力
                                    </p>
                                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md text-sm">
                                        开始阅读
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">写作训练</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        提高英语写作水平
                                    </p>
                                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-md text-sm">
                                        开始写作
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">翻译练习</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        中英文互译训练
                                    </p>
                                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm">
                                        开始翻译
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">模拟测试</h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        模拟真实考试环境
                                    </p>
                                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm">
                                        开始测试
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

