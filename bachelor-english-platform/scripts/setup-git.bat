@echo off
chcp 65001 >nul

echo 🚀 设置Git仓库...

REM 初始化git仓库
echo 📋 初始化Git仓库...
git init

REM 添加.gitignore文件
echo 📝 添加.gitignore文件...
git add .gitignore

REM 检查被忽略的文件
echo 🔍 检查被忽略的文件...
git status --ignored

REM 添加所有文件（除了被忽略的）
echo 📦 添加项目文件...
git add .

REM 显示状态
echo 📊 Git状态：
git status

echo.
echo ✅ Git设置完成！
echo.
echo 📋 下一步操作：
echo 1. 运行 'git commit -m "Initial commit"' 创建初始提交
echo 2. 运行 'git remote add origin <your-repo-url>' 添加远程仓库
echo 3. 运行 'git push -u origin main' 推送到远程仓库
echo.
pause
