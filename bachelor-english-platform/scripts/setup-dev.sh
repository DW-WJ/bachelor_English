#!/bin/bash

# 学位英语学习平台 - 开发环境设置脚本

echo "🚀 开始设置开发环境..."

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node -v)
echo "Node.js版本: $node_version"

# 安装依赖
echo "📦 安装项目依赖..."
npm run install:all

# 设置后端环境变量
echo "⚙️ 设置后端环境变量..."
cd backend

# 创建.env文件（如果不存在）
if [ ! -f .env ]; then
    echo "创建.env文件..."
    cat > .env << EOF
# 数据库配置 - 使用SQLite作为开发数据库
DATABASE_URL="file:./dev.db"

# JWT配置
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# 服务器配置
PORT=3001
NODE_ENV="development"

# 前端URL (用于CORS)
FRONTEND_URL="http://localhost:3000"

# 其他配置
BCRYPT_ROUNDS=12
EOF
    echo "✅ .env文件创建成功"
else
    echo "✅ .env文件已存在"
fi

# 生成Prisma客户端
echo "🔧 生成Prisma客户端..."
npm run db:generate

# 运行数据库迁移
echo "🗄️ 运行数据库迁移..."
npm run db:migrate

# 添加种子数据
echo "🌱 添加种子数据..."
npm run db:seed

# 返回根目录
cd ..

echo "🎉 开发环境设置完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行 'npm run dev' 启动开发服务器"
echo "2. 访问 http://localhost:3000 查看前端"
echo "3. 访问 http://localhost:3001/api/v1 查看API"
echo "4. 运行 'cd backend && npm run db:studio' 查看数据库"
echo ""
echo "🚀 现在可以开始开发了！"
