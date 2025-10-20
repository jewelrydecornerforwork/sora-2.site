# Sora-2 Ai - 图像转视频生成器

一个基于 AI 的专业图像转视频生成器网站，支持运动控制和音频集成。

🌐 **网站地址**: [https://sora-2.site](https://sora-2.site)

## 功能特性

- 🎯 **运动控制**: 基于文本提示的精确运动生成
- 🎵 **音频集成**: 支持 WAV/MP3 背景音乐
- ⏱️ **灵活时长**: 5秒或10秒视频生成
- 🖼️ **多格式支持**: JPEG、PNG、BMP、WEBP 图像
- 💳 **积分系统**: 灵活的付费模式
- 🔐 **用户认证**: 完整的用户管理系统
- 🆓 **免费 API**: 支持 Replicate 和 Hugging Face 免费服务

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, Node.js
- **数据库**: Prisma + PostgreSQL (或 SQLite 开发)
- **认证**: NextAuth.js
- **支付**: Stripe
- **部署**: Vercel
- **AI 服务**: Replicate API (免费) / Hugging Face Inference API (免费) / Stable Video Diffusion

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
# 创建 .env.local 文件
touch .env.local
# 编辑 .env.local 文件，填入必要的环境变量
```

**重要**: 配置免费 AI API 密钥以启用视频生成功能：

- **选项 1: Replicate API**（推荐，每月免费 $5 积分）
  - 注册: https://replicate.com/
  - 获取密钥: https://replicate.com/account/api-tokens
  - 在 `.env.local` 中设置 `REPLICATE_API_TOKEN="r8_..."`

- **选项 2: Hugging Face API**（完全免费，有速率限制）
  - 注册: https://huggingface.co/
  - 获取密钥: https://huggingface.co/settings/tokens
  - 在 `.env.local` 中设置 `HF_API_TOKEN="hf_..."`

📖 **配置说明**: 在 `.env.local` 文件中添加相应的 API 密钥即可启用视频生成功能

4. **启动开发服务器**
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
6. 设置自定义域名 `sora-2.site`
7. 点击 "Deploy"

### 3. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

**必需（免费 API）**:
```
# 二选一或都配置
REPLICATE_API_TOKEN=your-replicate-token
HF_API_TOKEN=your-huggingface-token
```

**可选**:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://sora-2.site
DATABASE_URL=your-database-url
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable
```

📖 **如何获取免费 API 密钥**: 按照上述步骤注册相应服务并获取 API 密钥

## 项目结构

```
sora-2.site/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API 路由
│   │   └── generate-video/ # 视频生成 API
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── providers.tsx      # 上下文提供者
├── components/            # React 组件
│   ├── Header.tsx         # 网站头部
│   ├── Hero.tsx           # 首页英雄区
│   ├── VideoGenerator.tsx # 视频生成器
│   ├── Features.tsx       # 功能特性
│   ├── FAQ.tsx            # 常见问题
│   └── Footer.tsx         # 网站底部
├── public/                # 静态资源
│   ├── demo-video.mp4     # 演示视频
│   └── demo-image.jpg     # 演示图像
└── 配置文件...            # 必要的配置文件
```

## 开发指南

### 添加新功能

1. 在 `components/` 目录创建新组件
2. 在 `app/api/` 目录添加 API 路由
3. 测试功能
4. 提交代码

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 组件使用函数式组件和 Hooks
- 使用 Tailwind CSS 进行样式设计

## 许可证

MIT License

## 支持

如有问题，请提交 Issue 或联系开发团队。

