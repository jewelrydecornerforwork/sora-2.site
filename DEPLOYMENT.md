# Sora 2 AI 部署指南

本指南将帮助你将 Sora 2 AI 网站部署到 Vercel 平台。

## 准备工作

### 1. 环境要求

- Node.js 18+ 
- Git
- GitHub 账号
- Vercel 账号

### 2. 获取必要的 API 密钥

在开始部署之前，你需要准备以下 API 密钥：

#### 数据库
- **PostgreSQL 数据库**: 推荐使用 [Supabase](https://supabase.com) 或 [PlanetScale](https://planetscale.com)
- 获取数据库连接字符串

#### 认证服务
- **Google OAuth**: 在 [Google Cloud Console](https://console.cloud.google.com) 创建 OAuth 应用
- **GitHub OAuth**: 在 [GitHub Developer Settings](https://github.com/settings/developers) 创建 OAuth 应用

#### AI 服务
- **OpenAI API**: 在 [OpenAI Platform](https://platform.openai.com) 获取 API 密钥
- **其他 AI 服务**: Runway、Pika Labs 等（可选）

#### 支付服务
- **Stripe**: 在 [Stripe Dashboard](https://dashboard.stripe.com) 获取 API 密钥

## 部署步骤

### 步骤 1: 准备 GitHub 仓库

1. 在 GitHub 上创建一个新仓库
2. 将代码推送到仓库：

```bash
git init
git add .
git commit -m "Initial commit: Sora 2 AI website"
git branch -M main
git remote add origin https://github.com/yourusername/sora-2-site.git
git push -u origin main
```

### 步骤 2: 设置 Vercel 项目

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. 点击 "Import"

### 步骤 3: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量

```bash
# 数据库
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI 服务
OPENAI_API_KEY=sk-...
```

#### 可选的环境变量

```bash
# 其他 AI 服务
REPLICATE_API_TOKEN=r8_...
RUNPOD_API_KEY=...

# 应用配置
APP_NAME=Sora 2 AI
APP_URL=https://your-domain.vercel.app
```

### 步骤 4: 配置数据库

1. 在 Supabase 或 PlanetScale 创建数据库
2. 将数据库连接字符串添加到 Vercel 环境变量
3. 在 Vercel 部署后，运行数据库迁移：

```bash
# 在 Vercel 函数中或本地运行
npx prisma db push
```

### 步骤 5: 配置 OAuth 应用

#### Google OAuth 配置

1. 在 Google Cloud Console 创建 OAuth 2.0 客户端 ID
2. 添加授权重定向 URI：
   - `https://your-domain.vercel.app/api/auth/callback/google`
3. 将客户端 ID 和密钥添加到 Vercel 环境变量

#### GitHub OAuth 配置

1. 在 GitHub Developer Settings 创建 OAuth App
2. 设置 Authorization callback URL：
   - `https://your-domain.vercel.app/api/auth/callback/github`
3. 将客户端 ID 和密钥添加到 Vercel 环境变量

### 步骤 6: 配置 Stripe 支付

1. 在 Stripe Dashboard 获取 API 密钥
2. 设置 Webhook 端点：
   - `https://your-domain.vercel.app/api/webhooks/stripe`
3. 配置 Webhook 事件：
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 步骤 7: 部署

1. 在 Vercel 中点击 "Deploy"
2. 等待部署完成
3. 访问你的网站 URL

## 部署后配置

### 1. 数据库初始化

部署完成后，需要初始化数据库：

```bash
# 在 Vercel 函数中运行
npx prisma db push
```

### 2. 测试功能

1. 测试用户注册/登录
2. 测试图像上传
3. 测试视频生成
4. 测试支付功能

### 3. 监控和日志

- 在 Vercel Dashboard 查看部署日志
- 设置错误监控（推荐使用 Sentry）
- 配置性能监控

## 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
1. 环境变量是否正确配置
2. 数据库连接是否正常
3. API 密钥是否有效
4. 查看 Vercel 部署日志

### Q: 如何更新网站？

A: 推送代码到 GitHub，Vercel 会自动重新部署。

### Q: 如何添加自定义域名？

A: 在 Vercel 项目设置中添加自定义域名。

### Q: 如何处理大文件上传？

A: 配置 Vercel 的 `vercel.json` 文件：

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

## 性能优化

### 1. 图片优化

- 使用 Next.js Image 组件
- 配置图片 CDN
- 压缩图片文件

### 2. 代码分割

- 使用动态导入
- 配置 Webpack 代码分割
- 优化包大小

### 3. 缓存策略

- 配置静态资源缓存
- 使用 Redis 缓存（可选）
- 优化 API 响应时间

## 安全考虑

1. 定期更新依赖包
2. 使用 HTTPS
3. 验证用户输入
4. 限制 API 调用频率
5. 保护敏感信息

## 备份策略

1. 定期备份数据库
2. 备份用户上传的文件
3. 版本控制代码
4. 监控系统状态

## 支持

如果遇到问题，请：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Next.js 文档](https://nextjs.org/docs)
3. 提交 Issue 到项目仓库
4. 联系技术支持

---

祝你部署顺利！🎉

