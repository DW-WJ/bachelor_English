-- 创建管理员用户的SQL脚本
-- 请在DataGrip中执行此脚本

-- 首先确保数据库表已创建（如果使用Prisma迁移，表应该已存在）

-- 插入管理员用户
INSERT INTO users (
    id,
    email,
    username,
    password,
    level,
    role,
    isActive,
    createdAt,
    updatedAt
) VALUES (
    'admin-user-id-001',
    'admin@bachelor-english.com',
    'admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kz8KzK', -- 密码: admin123456
    'advanced',
    'admin',
    1,
    datetime('now'),
    datetime('now')
);

-- 验证管理员用户是否创建成功
SELECT 
    id,
    email,
    username,
    role,
    level,
    isActive,
    createdAt
FROM users 
WHERE role = 'admin';
