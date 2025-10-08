# Sora 2 AI - 图像转视频生成器

一个基于 AI 的专业图像转视频生成器网站，支持运动控制、音频集成和多分辨率输出。

## 功能特性

- 🎬 **多分辨率支持**: 480p、720p、1080p 视频生成
- 🎯 **运动控制**: 基于文本提示的精确运动生成
- 🎵 **音频集成**: 支持 WAV/MP3 背景音乐
- ⏱️ **灵活时长**: 5秒或10秒视频生成
- 🖼️ **多格式支持**: JPEG、PNG、BMP、WEBP 图像
- 💳 **积分系统**: 灵活的付费模式
- 🔐 **用户认证**: 完整的用户管理系统

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, Node.js
- **数据库**: Prisma + PostgreSQL (或 SQLite 开发)
- **认证**: NextAuth.js
- **支付**: Stripe
- **部署**: Vercel
- **AI 服务**: OpenAI API 或其他 AI 视频生成服务

## 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn
- Git

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd sora-2.site
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入必要的环境变量
```

4. **数据库设置**
```bash
npx prisma generate
npx prisma db push
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 部署到 Vercel

### 1. 准备 GitHub 仓库

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/sora-2-site.git
git push -u origin main
```

### 2. 连接 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 配置环境变量
6. 点击 "Deploy"

### 3. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
DATABASE_URL=your-database-url
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
OPENAI_API_KEY=your-openai-key
```

## 项目结构

```
sora-2.site/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API 路由
│   ├── auth/              # 认证页面
│   ├── dashboard/         # 用户仪表板
│   └── page.tsx           # 首页
├── components/            # React 组件
├── lib/                   # 工具函数和配置
├── prisma/               # 数据库模式
├── public/               # 静态资源
└── styles/               # 样式文件
```

## 开发指南

### 添加新功能

1. 在 `components/` 目录创建新组件
2. 在 `app/api/` 目录添加 API 路由
3. 更新数据库模式（如需要）
4. 测试功能
5. 提交代码

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 组件使用函数式组件和 Hooks
- 使用 Tailwind CSS 进行样式设计

## 许可证

MIT License

## 支持

如有问题，请提交 Issue 或联系开发团队。

