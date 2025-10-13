# 图片转视频 API 更新总结

## 📋 问题诊断

**原问题**: 图片转视频生成器功能无法使用，只返回演示视频。

**根本原因**: API 路由 (`app/api/generate-video/route.ts`) 仅实现了演示模式，未集成真实的 AI 视频生成服务。

---

## ✅ 已完成的更新

### 1. API 路由重构

**文件**: `app/api/generate-video/route.ts`

**主要改动**:
- ✅ 集成 **Replicate API**（Stable Video Diffusion 模型）
- ✅ 集成 **Hugging Face Inference API**（完全免费）
- ✅ 实现自动回退机制（API失败时返回演示视频）
- ✅ 添加详细的日志输出
- ✅ 支持 Base64 图片编码和传输

**核心功能**:
```typescript
// 优先使用 Replicate（质量最佳）
if (hasReplicateToken) {
  videoUrl = await generateWithReplicate(imageBase64, prompt)
} 
// 备选使用 Hugging Face（完全免费）
else if (hasHFToken) {
  videoUrl = await generateWithHuggingFace(imageBase64, prompt)
}
```

### 2. 环境变量配置

**文件**: `env.example`

**新增配置**:
```env
# Replicate API - 推荐（每月免费 $5 积分）
REPLICATE_API_TOKEN="r8_..."

# Hugging Face API - 完全免费（有速率限制）
HF_API_TOKEN="hf_..."
```

### 3. 文档创建

**新建文件**:

1. **`FREE_API_SETUP.md`** - 详细的免费 API 设置指南
   - Replicate 注册和配置步骤
   - Hugging Face 注册和配置步骤
   - 常见问题解答
   - 测试方法说明

2. **`QUICKSTART_API.md`** - 5分钟快速开始指南
   - 最快路径配置（推荐 Replicate）
   - 验证步骤
   - 常见问题速查
   - API 对比表

3. **`scripts/test-video-api.js`** - API 配置测试脚本
   - 自动检查 API Token 配置
   - 测试 API 连接状态
   - 显示账户信息

### 4. README 更新

**文件**: `README.md`

**更新内容**:
- ✅ 添加免费 API 功能说明
- ✅ 更新技术栈（添加 Replicate 和 Hugging Face）
- ✅ 更新快速开始步骤（包含 API 配置）
- ✅ 更新 Vercel 部署环境变量说明

### 5. NPM 脚本

**文件**: `package.json`

**新增命令**:
```json
"test:api": "node scripts/test-video-api.js"
```

---

## 🎯 免费 API 方案对比

| API 服务 | 免费额度 | 质量 | 速度 | 推荐度 |
|---------|---------|------|------|--------|
| **Replicate** | 每月 $5 (约50次) | ⭐⭐⭐⭐⭐ | 30-60秒 | ✅ 首选 |
| **Hugging Face** | 完全免费 | ⭐⭐⭐⭐ | 首次冷启动20秒 | ✅ 备选 |

---

## 🚀 如何使用（快速版）

### 步骤 1: 获取免费 API Token

**选项 A: Replicate（推荐）**
1. 访问 https://replicate.com/ 注册
2. 访问 https://replicate.com/account/api-tokens 获取 token
3. 复制 token（格式: `r8_...`）

**选项 B: Hugging Face（完全免费）**
1. 访问 https://huggingface.co/ 注册
2. 访问 https://huggingface.co/settings/tokens 创建 token
3. 复制 token（格式: `hf_...`）

### 步骤 2: 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# 二选一或都配置
REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxx"
HF_API_TOKEN="hf_xxxxxxxxxxxxx"
```

### 步骤 3: 测试配置

```bash
# 测试 API 配置
npm run test:api

# 启动开发服务器
npm run dev
```

### 步骤 4: 生成视频

1. 访问 http://localhost:3000
2. 上传图片
3. 输入运动描述
4. 点击"生成视频"
5. 等待 30-60 秒

---

## 📊 API 工作流程

```
用户上传图片 + 输入描述
        ↓
检查 API Token 配置
        ↓
    有配置？
   ↙     ↘
 是       否
 ↓        ↓
优先使用  返回演示视频
Replicate
 ↓
成功？
↙  ↘
是   否
↓    ↓
返回  尝试使用
视频  Hugging Face
      ↓
     成功？
     ↙  ↘
    是   否
    ↓    ↓
   返回  返回演示视频
   视频  (带错误信息)
```

---

## 🧪 测试清单

- [ ] 运行 `npm run test:api` 验证 Token 配置
- [ ] 启动开发服务器 `npm run dev`
- [ ] 上传测试图片
- [ ] 输入运动描述（如："Camera slowly zooms in"）
- [ ] 查看浏览器控制台日志
- [ ] 查看终端日志输出
- [ ] 验证视频生成成功

**预期日志输出**:
```
🎬 收到视频生成请求
🔑 API 密钥状态: { hasReplicateToken: true, hasHFToken: true }
⏳ 开始生成视频...
📡 使用 Replicate API 生成视频...
⏳ 预测 ID: xxxxx
📊 状态: processing
📊 状态: succeeded
✅ 视频生成成功
```

---

## ⚠️ 注意事项

### Replicate API
- 每月免费 $5 积分（约 50 次视频生成）
- 每次生成约消耗 $0.10
- 积分每月 1 号重置
- 查看用量: https://replicate.com/account/billing

### Hugging Face API
- 完全免费，无限制使用
- 有速率限制（每小时约 30-50 次）
- 首次使用时模型需要冷启动（约 20 秒）
- 可能遇到 503 错误（模型加载中），重试即可

### 自动回退机制
如果配置了 API Token 但调用失败，系统会：
1. 记录错误日志
2. 自动返回演示视频
3. 在响应消息中说明失败原因

---

## 🔧 故障排除

### 问题 1: 仍然显示演示视频

**解决方法**:
```bash
# 1. 检查 .env.local 文件是否存在
ls -la .env.local

# 2. 检查内容格式
cat .env.local

# 3. 确认格式正确
REPLICATE_API_TOKEN="r8_xxxx..."  # ✅ 正确
REPLICATE_API_TOKEN=r8_xxxx...    # ❌ 缺少引号
REPLICATE_API_TOKEN = "r8_..."    # ❌ 有多余空格

# 4. 重启开发服务器
npm run dev
```

### 问题 2: API Token 无效

**检查步骤**:
1. 访问 API 服务网站重新生成 Token
2. 确认 Token 复制完整（包括前缀 `r8_` 或 `hf_`）
3. 检查 Token 未过期
4. 运行 `npm run test:api` 测试连接

### 问题 3: 生成时间过长

**正常情况**:
- Replicate: 30-60 秒
- Hugging Face: 首次 40-60 秒，后续 20-30 秒

**异常情况**:
- 超过 2 分钟未响应 → 检查网络连接
- 重复 503 错误 → 等待 20 秒后重试

---

## 📈 性能优化建议

### 1. 同时配置两个 API

```env
REPLICATE_API_TOKEN="r8_..."
HF_API_TOKEN="hf_..."
```

优势：
- 主力使用 Replicate（质量最佳）
- Replicate 失败时自动切换到 Hugging Face
- 提高可用性和成功率

### 2. 监控用量

**Replicate**:
- 定期查看: https://replicate.com/account/billing
- 设置用量提醒

**Hugging Face**:
- 注意速率限制
- 避免在短时间内大量请求

### 3. 生产环境部署

**Vercel 环境变量配置**:
1. 登录 Vercel Dashboard
2. 选择项目 → Settings → Environment Variables
3. 添加:
   ```
   REPLICATE_API_TOKEN = r8_xxxxx...
   HF_API_TOKEN = hf_xxxxx...
   ```
4. 重新部署

---

## 📚 相关文档

- 📖 [FREE_API_SETUP.md](./FREE_API_SETUP.md) - 详细配置指南
- 📖 [QUICKSTART_API.md](./QUICKSTART_API.md) - 5分钟快速开始
- 📖 [README.md](./README.md) - 项目总览
- 🌐 [Replicate 文档](https://replicate.com/docs)
- 🌐 [Hugging Face 文档](https://huggingface.co/docs/api-inference)

---

## ✨ 更新内容总结

| 文件 | 状态 | 说明 |
|------|------|------|
| `app/api/generate-video/route.ts` | ✅ 已更新 | 集成 Replicate 和 Hugging Face API |
| `env.example` | ✅ 已更新 | 添加免费 API 配置说明 |
| `README.md` | ✅ 已更新 | 添加免费 API 使用说明 |
| `FREE_API_SETUP.md` | ✅ 新建 | 详细配置指南 |
| `QUICKSTART_API.md` | ✅ 新建 | 快速开始指南 |
| `scripts/test-video-api.js` | ✅ 新建 | API 测试脚本 |
| `package.json` | ✅ 已更新 | 添加 `test:api` 命令 |

---

**更新完成时间**: 2025-10-13  
**版本**: v2.0 - 免费 API 集成版

