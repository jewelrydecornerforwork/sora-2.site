#!/bin/bash

# Sora 2 AI 项目设置脚本

echo "🚀 开始设置 Sora 2 AI 项目..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v)
echo "当前 Node.js 版本: $node_version"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

# 复制环境变量文件
echo "⚙️ 设置环境变量..."
if [ ! -f .env.local ]; then
    cp env.example .env.local
    echo "✅ 已创建 .env.local 文件，请编辑其中的配置"
else
    echo "⚠️ .env.local 文件已存在，跳过复制"
fi

# 生成 Prisma 客户端
echo "🗄️ 生成 Prisma 客户端..."
npx prisma generate

# 推送数据库模式（开发环境）
echo "📊 设置数据库..."
if [ "$NODE_ENV" = "production" ]; then
    echo "⚠️ 生产环境，跳过数据库推送"
else
    npx prisma db push
    echo "✅ 数据库模式已推送"
fi

# 运行类型检查
echo "🔍 运行类型检查..."
npm run lint

echo "🎉 项目设置完成！"
echo ""
echo "下一步："
echo "1. 编辑 .env.local 文件，填入必要的环境变量"
echo "2. 运行 'npm run dev' 启动开发服务器"
echo "3. 访问 http://localhost:3000 查看网站"
echo ""
echo "部署到 Vercel："
echo "1. 将代码推送到 GitHub"
echo "2. 在 Vercel 中导入项目"
echo "3. 配置环境变量"
echo "4. 部署"
