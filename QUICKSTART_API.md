# 🚀 快速开始 - 免费 API 配置（5分钟）

本指南将帮助您在 **5分钟内** 配置免费的 AI 视频生成 API，让图片转视频功能立即可用。

---

## ⚡ 最快路径（推荐 Replicate）

### 1️⃣ 注册 Replicate 账号（2分钟）

1. 访问 https://replicate.com/
2. 点击 **"Sign Up"** → 使用 **GitHub** 登录（最快）
3. 验证邮箱（如果需要）

### 2️⃣ 获取 API Token（1分钟）

1. 访问 https://replicate.com/account/api-tokens
2. 点击 **"Create token"**
3. 复制生成的 token（格式: `r8_xxxxxxxxxxxxx`）

### 3️⃣ 配置项目（1分钟）

在项目根目录创建或编辑 `.env.local` 文件：

```env
REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxx"
```

将上面复制的 token 粘贴到引号中。

### 4️⃣ 测试配置（1分钟）

```bash
# 测试 API 配置
npm run test:api

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000，上传图片并生成视频！

---

## ✅ 验证步骤

### 方法 1: 命令行测试

```bash
npm run test:api
```

**预期输出**:
```
🧪 测试视频生成 API 配置
==================================================
✅ Replicate API Token 已配置
   Token 前缀: r8_xxxxxxxx...
   正在测试 Replicate API 连接...
   ✅ Replicate API 连接成功！
==================================================
✅ API 配置检查完成！
```

### 方法 2: 网站界面测试

1. 启动开发服务器: `npm run dev`
2. 访问 http://localhost:3000
3. 点击 **"Select Image"** 上传一张图片
4. 在 **"Motion Prompt"** 输入框中输入运动描述，例如：
   ```
   Camera slowly zooms in, gentle wind blows, clouds moving
   ```
5. 点击 **"Generate Video"** 按钮
6. 等待 30-60 秒，视频生成完成！

**查看控制台日志**（打开浏览器 F12 开发者工具）:
```
🎬 开始生成视频...
📤 发送请求到 API...
📥 收到响应: 200 OK
✅ 生成结果: { success: true, videoUrl: "...", ... }
```

---

## 🔄 备选方案 - Hugging Face（完全免费）

如果不想使用 Replicate，或者想要备选方案：

### 1️⃣ 注册 Hugging Face

1. 访问 https://huggingface.co/
2. 点击 **"Sign Up"** → 填写邮箱和密码
3. 验证邮箱

### 2️⃣ 创建 Access Token

1. 访问 https://huggingface.co/settings/tokens
2. 点击 **"New token"**
3. 名称: `video-generator`
4. 权限: 选择 **"Read"**
5. 点击 **"Generate token"**
6. 复制 token（格式: `hf_xxxxxxxxxxxxx`）

### 3️⃣ 配置项目

在 `.env.local` 中添加：

```env
HF_API_TOKEN="hf_xxxxxxxxxxxxx"
```

或者同时配置两个（推荐）：

```env
REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxx"
HF_API_TOKEN="hf_xxxxxxxxxxxxx"
```

这样系统会优先使用 Replicate（质量更好），失败时自动切换到 Hugging Face。

---

## 📊 两种 API 对比

| 特性 | Replicate | Hugging Face |
|------|-----------|--------------|
| **免费额度** | 每月 $5 积分（约50次） | 完全免费，无限制 |
| **质量** | ⭐⭐⭐⭐⭐ 最佳 | ⭐⭐⭐⭐ 良好 |
| **速度** | 快（30-60秒） | 中等（首次冷启动20秒） |
| **速率限制** | 每分钟10次 | 每小时30-50次 |
| **稳定性** | 高 | 中（冷启动可能503错误） |
| **推荐度** | ✅ 首选 | ✅ 备选 |

---

## ❓ 常见问题速查

### Q: 为什么还是显示演示视频？

**A**: 检查以下步骤：
```bash
# 1. 确认 .env.local 文件存在
ls -la .env.local

# 2. 确认 token 已配置
cat .env.local | grep TOKEN

# 3. 测试 API 配置
npm run test:api

# 4. 重启开发服务器
npm run dev
```

### Q: 报错 "未配置 REPLICATE_API_TOKEN"

**A**: 
- 检查文件名是 `.env.local`（不是 `.env` 或 `env.local`）
- 确认 token 格式正确（包含引号）
- 重启开发服务器

### Q: Hugging Face 报错 "503 Service Unavailable"

**A**: 
- 这是正常现象，表示模型正在加载（冷启动）
- 等待 20 秒后重试
- 或切换到 Replicate API

### Q: 免费额度用完了怎么办？

**A**: 
- **Replicate**: 每月重置，或升级到付费版
- **Hugging Face**: 完全免费，只需注意速率限制
- **演示模式**: 系统会自动回退

---

## 🎯 下一步

配置完成后，您可以：

1. ✅ 测试不同的运动描述提示词
2. ✅ 尝试不同分辨率和时长
3. ✅ 上传背景音乐
4. ✅ 部署到 Vercel（记得配置环境变量）

---

## 📚 更多资源

- 📖 **详细配置指南**: [FREE_API_SETUP.md](./FREE_API_SETUP.md)
- 📖 **项目文档**: [README.md](./README.md)
- 🌐 **Replicate 文档**: https://replicate.com/docs
- 🌐 **Hugging Face 文档**: https://huggingface.co/docs

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看 [FREE_API_SETUP.md](./FREE_API_SETUP.md) 详细文档
2. 运行 `npm run test:api` 检查配置
3. 查看浏览器控制台和终端日志
4. 提交 GitHub Issue

---

**祝您使用愉快！🎉**

