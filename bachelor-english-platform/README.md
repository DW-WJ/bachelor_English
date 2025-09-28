# 学位英语在线学习平台

一个专为学位英语考试设计的综合性在线学习平台，具有交互式学习模块、AI驱动的个性化推荐和游戏化学习体验。

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Git (版本控制)
- SQLite (开发环境) 或 MySQL 8.0+ (生产环境)
- Redis 7+ (可选)

### 安装步骤

1. **克隆仓库**
```bash
git clone <repository-url>
cd bachelor-english-platform
```

2. **快速设置（推荐）**
```bash
# Windows用户
scripts\setup-dev.bat

# Linux/macOS用户
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

3. **手动设置**
```bash
# 安装所有依赖
npm run install:all

# 设置环境变量（使用SQLite，无需安装MySQL）
# 在 backend/.env 文件中设置：
# DATABASE_URL="file:./dev.db"

# 设置数据库
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed
cd ..

# 启动开发服务器
npm run dev
```

4. **Git设置（可选）**
```bash
# Windows用户
scripts\setup-git.bat

# 手动设置
git init
git add .
git commit -m "Initial commit"
```

## 🏗️ 项目结构

```
bachelor-english-platform/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # App Router 页面
│   │   ├── components/      # React 组件
│   │   ├── hooks/          # 自定义钩子
│   │   ├── lib/            # 工具函数
│   │   ├── stores/         # Zustand 状态管理
│   │   └── types/          # TypeScript 类型
│   └── package.json
├── backend/                 # Express.js 后端API
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # API 路由
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── types/          # TypeScript 类型
│   ├── prisma/             # 数据库模式
│   └── package.json
├── docs/                   # 项目文档
├── scripts/                # 工具脚本
└── package.json           # 根项目配置
```

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS + Ant Design
- **状态管理**: Zustand + React Query
- **UI组件**: Ant Design
- **动画**: Framer Motion
- **图标**: Ant Design Icons + Lucide React

### 后端
- **运行时**: Node.js 18+
- **框架**: Express.js
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: MySQL 8.0
- **认证**: JWT
- **验证**: Zod

### 部署
- **前端**: Vercel
- **后端**: Railway / DigitalOcean
- **数据库**: PlanetScale / AWS RDS MySQL
- **监控**: Sentry

## 📋 可用脚本

### 开发
```bash
npm run dev              # 同时启动前端和后端
npm run dev:frontend     # 只启动前端
npm run dev:backend      # 只启动后端
```

### 构建
```bash
npm run build            # 构建所有项目
npm run build:frontend   # 构建前端
npm run build:backend    # 构建后端
```

### 数据库
```bash
npm run db:setup         # 设置数据库（生成客户端、迁移、种子数据）
npm run db:studio        # 打开 Prisma Studio
```

### 测试和代码质量
```bash
npm run test             # 运行所有测试
npm run lint             # 检查代码质量
```

## 🎯 核心功能

### 学习模块
- **词汇学习**: 交互式单词卡片、发音练习、间隔重复
- **语法学习**: 交互式练习、详细解释、进度跟踪
- **阅读理解**: 文章阅读、题目练习、词汇积累
- **写作练习**: AI辅助写作、模板、同伴互评
- **翻译练习**: 中英翻译练习，带反馈

### 智能功能
- **自适应学习**: AI驱动的个性化学习路径
- **进度分析**: 详细的学习分析和洞察
- **游戏化**: 积分、徽章、排行榜、成就系统
- **社交学习**: 学习小组、讨论、同伴互动

### 技术功能
- **响应式设计**: 移动优先设计，支持PWA
- **实时更新**: 实时进度跟踪和通知
- **离线支持**: 离线学习功能
- **性能优化**: 快速加载和流畅体验

## 🔧 开发指南

### 添加新功能
1. 在后端 `src/` 目录下创建相应的控制器、服务和路由
2. 更新 Prisma 模式（如需要）
3. 运行数据库迁移
4. 在前端 `src/` 目录下创建相应的组件和页面
5. 更新类型定义

### 数据库操作
```bash
# 生成 Prisma 客户端
cd backend && npm run db:generate

# 创建迁移
cd backend && npm run db:migrate

# 应用迁移到生产环境
cd backend && npm run db:deploy

# 添加种子数据
cd backend && npm run db:seed
```

### API 文档
启动后端服务器后，访问 `http://localhost:3001/api/v1` 查看 API 文档。

## 📊 项目状态

- ✅ 项目基础结构
- ✅ 前端框架搭建 (Next.js + Ant Design)
- ✅ 后端API框架 (Express.js + Prisma)
- ✅ 数据库设计 (MySQL)
- ✅ 用户认证系统
- ✅ 基础UI组件
- 🚧 词汇学习模块
- 🚧 语法学习模块
- 🚧 阅读理解模块
- 🚧 写作练习模块
- 🚧 翻译练习模块
- 🚧 AI推荐系统
- 🚧 游戏化功能

## 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或支持，请联系：
- 邮箱: support@bachelor-english-platform.com
- GitHub Issues: [创建问题](https://github.com/your-username/bachelor-english-platform/issues)

---

**今天就开始您的英语学习之旅吧！** 🎓✨