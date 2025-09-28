@echo off
chcp 65001 >nul

REM 学位英语学习平台 - 开发环境设置脚本 (Windows)

echo 🚀 开始设置开发环境...

REM 检查Node.js版本
echo 📋 检查Node.js版本...
node -v
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装，请先安装Node.js
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装项目依赖...
call npm run install:all
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 设置后端环境变量
echo ⚙️ 设置后端环境变量...
cd backend

REM 创建.env文件（如果不存在）
if not exist .env (
    echo 创建.env文件...
    (
        echo # 数据库配置 - 使用SQLite作为开发数据库
        echo DATABASE_URL="file:./dev.db"
        echo.
        echo # JWT配置
        echo JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
        echo JWT_EXPIRES_IN="7d"
        echo.
        echo # 服务器配置
        echo PORT=3001
        echo NODE_ENV="development"
        echo.
        echo # 前端URL ^(用于CORS^)
        echo FRONTEND_URL="http://localhost:3000"
        echo.
        echo # 其他配置
        echo BCRYPT_ROUNDS=12
    ) > .env
    echo ✅ .env文件创建成功
) else (
    echo ✅ .env文件已存在
)

REM 生成Prisma客户端
echo 🔧 生成Prisma客户端...
call npm run db:generate
if %errorlevel% neq 0 (
    echo ❌ Prisma客户端生成失败
    pause
    exit /b 1
)

REM 运行数据库迁移
echo 🗄️ 运行数据库迁移...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo ❌ 数据库迁移失败
    pause
    exit /b 1
)

REM 添加种子数据
echo 🌱 添加种子数据...
call npm run db:seed
if %errorlevel% neq 0 (
    echo ❌ 种子数据添加失败
    pause
    exit /b 1
)

REM 返回根目录
cd ..

echo 🎉 开发环境设置完成！
echo.
echo 📋 下一步操作：
echo 1. 运行 'npm run dev' 启动开发服务器
echo 2. 访问 http://localhost:3000 查看前端
echo 3. 访问 http://localhost:3001/api/v1 查看API
echo 4. 运行 'cd backend ^&^& npm run db:studio' 查看数据库
echo.
echo 🚀 现在可以开始开发了！
pause
