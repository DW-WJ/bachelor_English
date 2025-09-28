const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        console.log('🚀 开始创建管理员用户...');

        // 检查是否已存在管理员
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'admin' }
        });

        if (existingAdmin) {
            console.log('✅ 管理员用户已存在:', existingAdmin.email);
            return;
        }

        // 创建管理员用户
        const hashedPassword = await bcrypt.hash('admin123456', 12);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@bachelor-english.com',
                username: 'admin',
                password: hashedPassword,
                level: 'advanced',
                role: 'admin',
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                username: true,
                role: true,
                level: true,
                createdAt: true,
            }
        });

        console.log('🎉 管理员用户创建成功!');
        console.log('📧 邮箱:', admin.email);
        console.log('👤 用户名:', admin.username);
        console.log('🔑 密码: admin123456');
        console.log('🎭 角色:', admin.role);
        console.log('📊 等级:', admin.level);

    } catch (error) {
        console.error('❌ 创建管理员用户失败:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
