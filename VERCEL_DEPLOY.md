# Vercel 部署指南

## 1. 准备工作

### 创建 Vercel 账号

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub" 使用 GitHub 账号登录
4. 授权 Vercel 访问你的 GitHub 仓库

### 准备环境变量

在部署之前，你需要准备以下环境变量：

```bash
# 应用配置
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# 数据库（可选，用于完整功能）
DATABASE_URL=postgresql://username:password@host:port/database

# AI 服务（可选）
OPENAI_API_KEY=sk-...

# 支付服务（可选）
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuth 服务（可选）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 2. 部署步骤

### 方法一：通过 Vercel Dashboard

1. **导入项目**
   - 登录 Vercel Dashboard
   - 点击 "New Project"
   - 选择你的 GitHub 仓库 `sora-2-site`
   - 点击 "Import"

2. **配置项目**
   - **Project Name**: `sora-2-site`（或你喜欢的名称）
   - **Framework Preset**: Next.js（应该自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）

3. **添加环境变量**
   - 在 "Environment Variables" 部分
   - 点击 "Add" 添加每个环境变量
   - 确保为所有环境（Production, Preview, Development）添加变量

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成（通常需要 2-5 分钟）

### 方法二：通过 Vercel CLI

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录 Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
# 在项目根目录运行
vercel

# 首次部署会提示配置
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - What's your project's name? sora-2-site
# - In which directory is your code located? ./
```

4. **配置环境变量**
```bash
# 添加环境变量
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
# ... 添加其他环境变量

# 查看环境变量
vercel env ls
```

5. **重新部署**
```bash
vercel --prod
```

## 3. 配置自定义域名（可选）

1. **在 Vercel Dashboard 中**
   - 进入项目设置
   - 点击 "Domains"
   - 添加你的域名

2. **配置 DNS**
   - 在你的域名提供商处添加 CNAME 记录
   - 指向 `cname.vercel-dns.com`

3. **SSL 证书**
   - Vercel 会自动为你的域名配置 SSL 证书

## 4. 配置自动部署

### GitHub 集成

1. **连接 GitHub 仓库**
   - 在 Vercel 项目设置中
   - 确保 GitHub 仓库已连接

2. **自动部署设置**
   - **Production Branch**: `main`
   - **Preview Deployments**: 启用
   - **Automatic HTTPS**: 启用

### 部署钩子

1. **获取部署钩子 URL**
   - 在项目设置 > "Git" 中
   - 复制 "Deploy Hook URL"

2. **配置 GitHub Webhook**
   - 在 GitHub 仓库设置中
   - 添加 Webhook
   - URL: 你的 Deploy Hook URL
   - 事件: "Just the push event"

## 5. 性能优化

### 配置 vercel.json

确保你的 `vercel.json` 配置正确：

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 300
    }
  },
  "env": {
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "NEXTAUTH_URL": "@nextauth-url"
  }
}
```

### 图片优化

1. **使用 Next.js Image 组件**
2. **配置图片域名**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.vercel.app'],
  },
}
```

### 缓存配置

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=1, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

## 6. 监控和日志

### 查看部署日志

1. **在 Vercel Dashboard 中**
   - 进入项目
   - 点击 "Functions" 查看 API 日志
   - 点击 "Analytics" 查看性能数据

2. **使用 Vercel CLI**
```bash
# 查看部署日志
vercel logs

# 查看实时日志
vercel logs --follow
```

### 错误监控

1. **配置 Sentry（推荐）**
```bash
npm install @sentry/nextjs
```

2. **配置错误边界**
```javascript
// pages/_error.js
import * as Sentry from '@sentry/nextjs'

function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = async (context) => {
  await Sentry.captureUnderscoreErrorException(context)
  const { res, err } = context
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

## 7. 常见问题解决

### 部署失败

1. **检查构建日志**
   - 在 Vercel Dashboard 查看构建日志
   - 确保所有依赖都正确安装

2. **环境变量问题**
   - 确保所有必需的环境变量都已设置
   - 检查环境变量名称是否正确

3. **内存不足**
   - 在 `vercel.json` 中增加内存限制
   ```json
   {
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 300,
         "memory": 1024
       }
     }
   }
   ```

### 性能问题

1. **启用 Edge Functions**
```javascript
// app/api/example/route.ts
export const runtime = 'edge'
```

2. **使用 ISR（增量静态再生）**
```javascript
// app/page.tsx
export const revalidate = 60 // 60秒
```

3. **优化图片**
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用 CDN

## 8. 安全配置

### 环境变量安全

1. **不要提交敏感信息到代码**
2. **使用 Vercel 环境变量**
3. **定期轮换 API 密钥**

### 网络安全

1. **配置 CORS**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

2. **配置 CSP（内容安全策略）**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          },
        ],
      },
    ]
  },
}
```

## 9. 备份和恢复

### 数据备份

1. **数据库备份**
   - 如果使用外部数据库，定期备份
   - 使用数据库提供商的备份功能

2. **代码备份**
   - GitHub 仓库本身就是备份
   - 定期创建 release 标签

### 灾难恢复

1. **多区域部署**
   - 考虑在不同区域部署
   - 使用 CDN 提高可用性

2. **监控和告警**
   - 设置 Uptime 监控
   - 配置错误告警

## 10. 完成部署检查清单

- [ ] 项目成功部署到 Vercel
- [ ] 所有环境变量已配置
- [ ] 自定义域名已设置（如果适用）
- [ ] SSL 证书已激活
- [ ] 自动部署已配置
- [ ] 错误监控已设置
- [ ] 性能监控已配置
- [ ] 备份策略已实施

## 部署完成！

🎉 恭喜！你的 Sora 2 AI 网站现在已经成功部署到 Vercel。

**你的网站地址**: `https://your-project-name.vercel.app`

**下一步**:
1. 测试所有功能
2. 配置自定义域名
3. 设置监控和告警
4. 开始推广你的网站！

如果遇到任何问题，请查看 Vercel 文档或提交 Issue。

