# Sora-2.site 项目 - Claude 协作指南

## 项目概述

这是一个基于 AI 的图像转视频生成器网站，使用 Next.js 14 + TypeScript 构建。

### 核心功能
- 🎬 多分辨率视频生成（480p/720p/1080p）
- 🎯 文本提示的运动控制
- 🎵 音频集成（WAV/MP3）
- 💳 积分系统
- 🔐 用户认证（NextAuth.js）

### 技术栈
- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Prisma + PostgreSQL/SQLite
- **AI 服务**: Replicate API / Hugging Face Inference API
- **部署**: Vercel

## 项目结构

```
sora-2.site/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # NextAuth 认证
│   │   └── generate-video/ # 视频生成 API
│   ├── page.tsx           # 首页
│   ├── simple/            # 简单测试页
│   └── test/              # API 测试页
├── components/            # React 组件
│   ├── VideoGenerator.tsx # 视频生成器主组件
│   ├── Hero.tsx           # 首页 Hero 区域
│   ├── Features.tsx       # 功能展示
│   └── FAQ.tsx            # 常见问题
├── lib/                   # 工具函数
├── prisma/               # 数据库模式
└── public/               # 静态资源
```

## 当前状态

### ✅ 已完成
- 基础页面结构
- 视频生成 API（Replicate + Hugging Face）
- 前端 UI 组件
- API 配置脚本

### 🚧 待优化
- 用户认证系统
- 积分支付集成
- 性能优化
- 错误处理增强

## 开发指南

### 环境变量
关键配置在 `.env.local`:
- `REPLICATE_API_TOKEN` - Replicate API 密钥
- `HF_API_TOKEN` - Hugging Face API 密钥
- `NEXTAUTH_SECRET` - NextAuth 密钥
- `DATABASE_URL` - 数据库连接

### 运行项目
```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npx prisma generate  # 生成 Prisma 客户端
```

### API 端点
- `POST /api/generate-video` - 生成视频
- `/api/auth/*` - NextAuth 认证路由

## Claude 协作建议

在帮助我时，请：

1. **理解上下文**: 查看相关文件再提供建议
2. **遵循规范**: 
   - TypeScript 严格模式
   - React 函数组件 + Hooks
   - Tailwind CSS 样式
3. **关注性能**: Next.js 14 最佳实践
4. **安全第一**: API 密钥保护、输入验证
5. **中文注释**: 关键逻辑用中文解释

## 常见任务

### 添加新 API 端点
```typescript
// app/api/your-endpoint/route.ts
export async function POST(req: Request) {
  // 实现逻辑
}
```

### 创建新组件
```typescript
// components/YourComponent.tsx
export default function YourComponent() {
  // 组件逻辑
}
```

### 修改数据库模式
```prisma
// prisma/schema.prisma
model YourModel {
  // 字段定义
}
```

然后运行：
```bash
npx prisma generate
npx prisma db push
```

## 问题排查

### 视频生成失败
1. 检查 API 密钥是否配置
2. 查看终端错误日志
3. 验证图片格式和大小

### 构建错误
1. 删除 `.next` 文件夹
2. 运行 `npm run build`
3. 检查 TypeScript 类型错误

## 资源链接

- [Next.js 文档](https://nextjs.org/docs)
- [Replicate API](https://replicate.com/docs)
- [Hugging Face Inference](https://huggingface.co/docs/api-inference)
- [Prisma 文档](https://www.prisma.io/docs)

---

**最后更新**: 2025-10-14


