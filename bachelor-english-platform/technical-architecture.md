# Technical Architecture

## 🏗️ System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   Cache Layer   │    │   File Storage  │
│   (Vercel)      │    │   (Redis)       │    │   (AWS S3)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Ant Design
- **State Management**: Zustand + React Query
- **UI Components**: Ant Design (Primary)
- **Icons**: Ant Design Icons + Lucide React
- **Animation**: Framer Motion
- **Testing**: Jest + React Testing Library

### Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   ├── (dashboard)/       # Dashboard route group
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── forms/            # Form components
│   │   ├── learning/         # Learning-specific components
│   │   └── layout/           # Layout components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── stores/               # Zustand stores
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Helper functions
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind configuration
├── next.config.js           # Next.js configuration
└── package.json
```

### Component Architecture
```typescript
// Component hierarchy example
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Footer
├── AuthProvider
├── ThemeProvider
└── Routes
    ├── HomePage
    ├── LearningCenter
    │   ├── VocabularyModule
    │   ├── GrammarModule
    │   ├── ReadingModule
    │   ├── WritingModule
    │   └── TranslationModule
    └── Dashboard
        ├── ProgressOverview
        ├── Analytics
        └── Settings
```

### State Management Strategy
```typescript
// Zustand stores
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

interface LearningState {
  currentModule: string;
  progress: ProgressData;
  achievements: Achievement[];
}

// React Query for server state
const useVocabulary = (level: string) => {
  return useQuery({
    queryKey: ['vocabulary', level],
    queryFn: () => fetchVocabulary(level),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### Ant Design Integration
```typescript
// Theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
    fontSize: 14,
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
    },
  },
};

// Custom components with Ant Design
const WordCard: React.FC<WordCardProps> = ({ word }) => {
  return (
    <Card className="word-card">
      <Card.Meta
        title={word.word}
        description={word.pronunciation}
      />
      <Button type="primary" onClick={handleFlip}>
        Show Meaning
      </Button>
    </Card>
  );
};
```

## 🔧 Backend Architecture

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Authentication**: JWT + Passport.js
- **Validation**: Zod
- **Testing**: Jest + Supertest

### Project Structure
```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── vocabulary.controller.ts
│   │   └── learning.controller.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── vocabulary.service.ts
│   │   └── learning.service.ts
│   ├── models/              # Data models
│   │   ├── user.model.ts
│   │   ├── vocabulary.model.ts
│   │   └── progress.model.ts
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── vocabulary.routes.ts
│   │   └── learning.routes.ts
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── utils/               # Utility functions
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── helpers.ts
│   └── types/               # TypeScript types
│       ├── auth.types.ts
│       ├── user.types.ts
│       └── learning.types.ts
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Database migrations
│   └── seed.ts              # Seed data
├── tests/                   # Test files
├── .env.example            # Environment variables example
└── package.json
```

### API Design
```typescript
// RESTful API structure
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   └── POST /forgot-password
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   ├── GET /progress
│   └── GET /achievements
├── /vocabulary
│   ├── GET /words
│   ├── GET /words/:id
│   ├── POST /study
│   ├── GET /review
│   └── POST /test
├── /grammar
│   ├── GET /lessons
│   ├── GET /exercises
│   └── POST /submit
├── /reading
│   ├── GET /passages
│   ├── GET /questions
│   └── POST /answers
├── /writing
│   ├── POST /submit
│   ├── GET /feedback
│   └── GET /templates
├── /translation
│   ├── GET /exercises
│   └── POST /submit
└── /analytics
    ├── GET /progress
    ├── GET /performance
    └── GET /recommendations
```

### Database Schema
```prisma
// Prisma schema example
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  avatar    String?
  level     String   @default("beginner")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
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
  examples      Json?
  audioUrl      String?
  createdAt     DateTime @default(now())

  // Relations
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

  // Relations
  user      User      @relation(fields: [userId], references: [id])
  vocabulary Vocabulary @relation(fields: [vocabularyId], references: [id])

  @@unique([userId, vocabularyId])
  @@map("user_vocabulary")
}
```

## 🗄️ Database Architecture

### Database Design Principles
- **Normalization**: Proper database normalization
- **Indexing**: Strategic indexing for performance
- **Relationships**: Clear foreign key relationships
- **Constraints**: Data integrity constraints
- **Migrations**: Version-controlled schema changes

### Core Tables
```sql
-- Users and Authentication
users
user_sessions
user_profiles

-- Learning Content
vocabulary
grammar_lessons
reading_passages
writing_prompts
translation_exercises

-- Learning Progress
learning_progress
user_vocabulary
user_achievements
test_records

-- Social Features
study_groups
discussions
user_follows
```

### Performance Optimization
```sql
-- Indexes for performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_vocabulary_difficulty ON vocabulary(difficulty);
CREATE INDEX idx_user_vocabulary_user_id ON user_vocabulary(user_id);
CREATE INDEX idx_user_vocabulary_next_review ON user_vocabulary(next_review);

-- Composite indexes
CREATE INDEX idx_user_progress_module ON learning_progress(user_id, module_type);
CREATE INDEX idx_test_records_user_date ON test_records(user_id, completed_at);
```

## 🔐 Security Architecture

### Authentication & Authorization
```typescript
// JWT Authentication
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Role-based access control
enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

// Middleware for protected routes
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

### Data Validation
```typescript
// Zod schemas for validation
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20),
  password: z.string().min(8),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const vocabularySchema = z.object({
  word: z.string().min(1),
  meaning: z.string().min(1),
  pronunciation: z.string().optional(),
  partOfSpeech: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  examples: z.array(z.object({
    sentence: z.string(),
    translation: z.string()
  })).optional()
});
```

## 🚀 Deployment Architecture

### Frontend Deployment (Vercel)
```yaml
# vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

### Backend Deployment (Railway)
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### Environment Configuration
```bash
# .env.production
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=your-jwt-secret
API_URL=https://api.bachelor-english-platform.com
FRONTEND_URL=https://bachelor-english-platform.com
```

## 📊 Monitoring & Analytics

### Application Monitoring
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Custom error tracking
const trackError = (error: Error, context: any) => {
  Sentry.captureException(error, {
    tags: {
      component: context.component,
      action: context.action,
    },
    extra: context,
  });
};
```

### Performance Monitoring
```typescript
// Performance tracking
const trackPerformance = (metric: string, value: number) => {
  // Send to analytics service
  analytics.track('performance_metric', {
    metric,
    value,
    timestamp: Date.now(),
  });
};

// API response time tracking
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    trackPerformance('api_response_time', duration);
  });
  
  next();
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📱 Mobile & PWA Support

### Progressive Web App
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Next.js config
});

// Service Worker
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('Offline', { status: 503 });
      })
    );
  }
});
```

### Responsive Design
```css
/* Mobile-first approach */
.word-card {
  @apply w-full p-4;
}

@media (min-width: 768px) {
  .word-card {
    @apply w-1/2 p-6;
  }
}

@media (min-width: 1024px) {
  .word-card {
    @apply w-1/3 p-8;
  }
}
```

---

*This technical architecture provides a solid foundation for building a scalable, maintainable, and performant Bachelor English Learning Platform.*
