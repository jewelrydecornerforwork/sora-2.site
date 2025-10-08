# Sora 2 AI 快速开始指南

欢迎使用 Sora 2 AI！这个指南将帮助你在几分钟内启动并运行你的图像转视频生成器网站。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装项目依赖
npm install
```

### 2. 环境配置

```bash
# 复制环境变量模板
copy env.example .env.local
```

编辑 `.env.local` 文件，填入必要的配置：

```bash
# 数据库配置（开发环境可以使用 SQLite）
DATABASE_URL="file:./dev.db"

# NextAuth 配置
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 其他配置（可选，用于完整功能）
OPENAI_API_KEY="sk-..."
STRIPE_SECRET_KEY="sk_test_..."
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npx prisma generate

# 推送数据库模式
npx prisma db push
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看你的网站！

## 📁 项目结构

```
sora-2.site/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证相关
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
│   ├── Pricing.tsx        # 定价方案
│   ├── FAQ.tsx            # 常见问题
│   └── Footer.tsx         # 网站底部
├── lib/                   # 工具函数
│   ├── auth.ts            # 认证配置
│   └── prisma.ts          # 数据库客户端
├── prisma/                # 数据库模式
│   └── schema.prisma      # 数据库结构
├── public/                # 静态资源
├── scripts/               # 脚本文件
└── README.md              # 项目说明
```

## 🎯 主要功能

### ✅ 已实现功能

- [x] 响应式网站设计
- [x] 用户认证系统
- [x] 图像上传和预览
- [x] 视频生成界面
- [x] 定价方案展示
- [x] 常见问题页面
- [x] 数据库模型设计
- [x] API 路由结构

### 🚧 待完善功能

- [ ] 实际 AI 视频生成集成
- [ ] 支付系统集成
- [ ] 用户仪表板
- [ ] 视频历史记录
- [ ] 积分系统
- [ ] 邮件通知

## 🛠️ 开发指南

### 添加新功能

1. **创建组件**：在 `components/` 目录添加新组件
2. **添加 API 路由**：在 `app/api/` 目录添加新的 API 端点
3. **更新数据库**：修改 `prisma/schema.prisma` 并运行 `npx prisma db push`
4. **测试功能**：在开发环境中测试新功能

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 组件使用函数式组件和 Hooks
- 使用 Tailwind CSS 进行样式设计
- 添加必要的注释和文档

### 调试技巧

1. **查看控制台**：使用浏览器开发者工具
2. **检查网络请求**：在 Network 标签页查看 API 调用
3. **数据库调试**：使用 `npx prisma studio` 查看数据库
4. **日志输出**：在代码中添加 `console.log` 进行调试

## 🚀 部署到生产环境

### 使用 Vercel 部署

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入 GitHub 仓库
   - 配置环境变量
   - 部署

3. **配置数据库**
   - 使用 Supabase 或 PlanetScale
   - 更新 `DATABASE_URL` 环境变量
   - 运行数据库迁移

详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 常见问题

### Q: 如何修改网站标题和描述？

A: 编辑 `app/layout.tsx` 文件中的 `metadata` 对象。

### Q: 如何添加新的页面？

A: 在 `app/` 目录下创建新的文件夹和 `page.tsx` 文件。

### Q: 如何修改样式？

A: 使用 Tailwind CSS 类名，或编辑 `app/globals.css` 文件。

### Q: 如何添加新的 API 端点？

A: 在 `app/api/` 目录下创建新的文件夹和 `route.ts` 文件。

### Q: 数据库连接失败怎么办？

A: 检查 `DATABASE_URL` 环境变量是否正确配置。

## 📚 学习资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [NextAuth.js 文档](https://next-auth.js.org)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

---

祝你开发愉快！如果遇到问题，请查看文档或提交 Issue。🎉

