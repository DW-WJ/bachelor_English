# MySQL数据库配置指南

## 🗄️ MySQL vs PostgreSQL 对比

### 相似之处
- **关系型数据库**: 都支持ACID事务
- **SQL标准**: 都遵循SQL标准，语法相似度90%+
- **Prisma支持**: Prisma对两者都有很好的支持
- **性能**: 对于中小型应用，性能差异不大

### 主要差异
| 特性 | MySQL | PostgreSQL |
|------|-------|------------|
| **JSON支持** | 原生JSON类型 | JSONB类型（更强大） |
| **全文搜索** | 基础支持 | 高级全文搜索 |
| **扩展性** | 插件系统 | 更丰富的扩展 |
| **学习曲线** | 相对简单 | 功能更全面但复杂 |
| **社区** | 更广泛使用 | 开发者社区活跃 |

## 🚀 MySQL配置步骤

### 1. 安装MySQL 8.0

#### Windows
```bash
# 下载MySQL Installer
# https://dev.mysql.com/downloads/installer/

# 或使用Chocolatey
choco install mysql

# 或使用WSL
wsl --install
# 然后在WSL中安装MySQL
```

#### macOS
```bash
# 使用Homebrew
brew install mysql

# 启动MySQL服务
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
# 更新包列表
sudo apt update

# 安装MySQL
sudo apt install mysql-server

# 启动MySQL服务
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. 创建数据库和用户

```sql
-- 连接到MySQL
mysql -u root -p

-- 创建数据库
CREATE DATABASE bachelor_english_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'bachelor_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 授权
GRANT ALL PRIVILEGES ON bachelor_english_platform.* TO 'bachelor_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 3. 配置Prisma

#### 更新schema.prisma
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  avatar    String?
  level     String   @default("beginner")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 关系
  progress     LearningProgress[]
  vocabulary   UserVocabulary[]
  achievements Achievement[]
  testRecords  TestRecord[]

  @@map("users")
}

model Vocabulary {
  id            String  @id @default(cuid())
  word          String  @unique
  pronunciation String?
  meaning       String
  partOfSpeech  String?
  difficulty    Int     @default(1)
  examples      Json?   // MySQL支持JSON类型
  audioUrl      String?
  createdAt     DateTime @default(now())

  // 关系
  userVocabulary UserVocabulary[]

  @@map("vocabulary")
}

model UserVocabulary {
  id            String     @id @default(cuid())
  userId        String
  vocabularyId  String
  masteryLevel  Int        @default(0)
  reviewCount   Int        @default(0)
  lastReviewed  DateTime?
  nextReview    DateTime?
  createdAt     DateTime   @default(now())

  // 关系
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  vocabulary Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)

  @@unique([userId, vocabularyId])
  @@map("user_vocabulary")
}

model LearningProgress {
  id          String   @id @default(cuid())
  userId      String
  moduleType  String   // 'vocabulary', 'grammar', 'reading', etc.
  moduleId    String
  progress    Float    @default(0.0)
  completed   Boolean  @default(false)
  score       Int?
  timeSpent   Int?     // 秒
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 关系
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, moduleType, moduleId])
  @@map("learning_progress")
}

model Achievement {
  id          String   @id @default(cuid())
  name        String
  description String
  icon        String?
  points      Int      @default(0)
  category    String   // 'vocabulary', 'grammar', 'streak', etc.
  createdAt   DateTime @default(now())

  // 关系
  users User[]

  @@map("achievements")
}

model TestRecord {
  id          String   @id @default(cuid())
  userId      String
  testType    String   // 'vocabulary', 'grammar', 'reading', etc.
  score       Int
  totalQuestions Int
  timeSpent   Int      // 秒
  answers     Json?    // 存储答案详情
  completedAt DateTime @default(now())

  // 关系
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("test_records")
}
```

#### 环境变量配置
```bash
# .env
DATABASE_URL="mysql://bachelor_user:your_secure_password@localhost:3306/bachelor_english_platform"

# .env.local (开发环境)
DATABASE_URL="mysql://bachelor_user:your_secure_password@localhost:3306/bachelor_english_platform_dev"

# .env.production (生产环境)
DATABASE_URL="mysql://bachelor_user:your_secure_password@your-production-host:3306/bachelor_english_platform"
```

### 4. 数据库迁移

```bash
# 生成Prisma客户端
npx prisma generate

# 创建迁移
npx prisma migrate dev --name init

# 应用迁移到生产环境
npx prisma migrate deploy

# 查看数据库
npx prisma studio
```

### 5. 种子数据

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建示例词汇
  const vocabulary = await prisma.vocabulary.createMany({
    data: [
      {
        word: 'abandon',
        pronunciation: '/əˈbændən/',
        meaning: '放弃，抛弃',
        partOfSpeech: 'verb',
        difficulty: 2,
        examples: JSON.stringify([
          {
            sentence: 'He had to abandon his car in the snow.',
            translation: '他不得不在雪中弃车。'
          }
        ])
      },
      {
        word: 'ability',
        pronunciation: '/əˈbɪləti/',
        meaning: '能力，才能',
        partOfSpeech: 'noun',
        difficulty: 1,
        examples: JSON.stringify([
          {
            sentence: 'She has the ability to learn quickly.',
            translation: '她有快速学习的能力。'
          }
        ])
      }
    ]
  });

  // 创建示例成就
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        name: '词汇新手',
        description: '学习第一个单词',
        icon: '🎯',
        points: 10,
        category: 'vocabulary'
      },
      {
        name: '语法大师',
        description: '完成所有语法练习',
        icon: '📚',
        points: 100,
        category: 'grammar'
      }
    ]
  });

  console.log('种子数据创建完成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```bash
# 运行种子数据
npx prisma db seed
```

## 🔧 MySQL优化配置

### 1. 性能优化

```sql
-- 创建索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_vocabulary_difficulty ON vocabulary(difficulty);
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_next_review ON user_vocabulary(next_review);
CREATE INDEX idx_learning_progress_user_module ON learning_progress(user_id, module_type);
CREATE INDEX idx_test_records_user_date ON test_records(user_id, completed_at);

-- 复合索引
CREATE INDEX idx_user_progress_composite ON learning_progress(user_id, module_type, completed);
CREATE INDEX idx_vocabulary_search ON vocabulary(word, difficulty, partOfSpeech);
```

### 2. 连接池配置

```typescript
// lib/database.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 3. 查询优化

```typescript
// 优化的查询示例
export async function getUserProgress(userId: string) {
  return await prisma.learningProgress.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          level: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });
}

// 分页查询
export async function getVocabularyPage(page: number, limit: number, difficulty?: number) {
  const skip = (page - 1) * limit;
  
  return await prisma.vocabulary.findMany({
    where: difficulty ? { difficulty } : {},
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });
}
```

## 🚀 部署选项

### 1. 云数据库服务

#### PlanetScale (推荐)
```bash
# 安装PlanetScale CLI
npm install -g @planetscale/cli

# 登录
pscale auth login

# 创建数据库
pscale database create bachelor-english-platform

# 创建分支
pscale branch create bachelor-english-platform main

# 获取连接字符串
pscale connect bachelor-english-platform main
```

#### AWS RDS MySQL
```bash
# 使用AWS CLI创建RDS实例
aws rds create-db-instance \
  --db-instance-identifier bachelor-english-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password your-secure-password \
  --allocated-storage 20
```

### 2. Docker部署

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: bachelor-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: bachelor_english_platform
      MYSQL_USER: bachelor_user
      MYSQL_PASSWORD: your_secure_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    command: --default-authentication-plugin=mysql_native_password

  redis:
    image: redis:7-alpine
    container_name: bachelor-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs mysql
```

## 📊 监控和维护

### 1. 性能监控

```sql
-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 查看连接数
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';

-- 查看查询缓存
SHOW STATUS LIKE 'Qcache%';
```

### 2. 备份策略

```bash
# 创建备份脚本
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mysql"
DB_NAME="bachelor_english_platform"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mysqldump -u bachelor_user -p$MYSQL_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# 压缩备份
gzip $BACKUP_DIR/backup_$DATE.sql

# 删除7天前的备份
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "备份完成: backup_$DATE.sql.gz"
```

### 3. 定期维护

```sql
-- 优化表
OPTIMIZE TABLE users, vocabulary, user_vocabulary, learning_progress;

-- 分析表
ANALYZE TABLE users, vocabulary, user_vocabulary, learning_progress;

-- 检查表
CHECK TABLE users, vocabulary, user_vocabulary, learning_progress;
```

## 🎯 最佳实践

### 1. 数据建模
- 使用适当的数据类型
- 创建必要的索引
- 设计合理的外键关系
- 考虑数据增长

### 2. 查询优化
- 使用EXPLAIN分析查询
- 避免SELECT *
- 使用LIMIT进行分页
- 合理使用JOIN

### 3. 安全考虑
- 使用强密码
- 限制用户权限
- 启用SSL连接
- 定期更新MySQL版本

---

**MySQL是一个优秀的选择！** 它与PostgreSQL在功能上非常相似，而且您已有的MySQL经验会让开发更加顺利。Prisma的ORM层会处理大部分数据库差异，让您可以专注于业务逻辑开发。
