# 免费 AI 视频生成 API 设置指南

本项目支持两种**免费的 AI 视频生成 API**服务，您可以选择其中一种或同时配置两种。

---

## 🎯 快速选择指南

| 服务 | 免费额度 | 质量 | 速度 | 推荐度 |
|------|---------|------|------|--------|
| **Replicate** | 每月 $5 积分 (约50次) | ⭐⭐⭐⭐⭐ | 快 (30-60秒) | ✅ 推荐 |
| **Hugging Face** | 完全免费，有速率限制 | ⭐⭐⭐⭐ | 中等 (首次冷启动20秒) | ✅ 备选 |

**建议**：优先使用 Replicate（质量最佳），Hugging Face 作为备选。

---

## 选项 1: Replicate API（推荐）

### ✨ 特点
- 每月免费 **$5** 积分（约 50 次视频生成）
- 使用 Stable Video Diffusion 模型
- 质量优秀，速度快
- 无需信用卡即可开始

### 📋 注册步骤

1. **访问 Replicate 官网**
   
   前往: https://replicate.com/

2. **注册账号**
   
   - 点击右上角 "Sign Up" 按钮
   - 使用 GitHub 账号登录（推荐）或邮箱注册
   - 验证邮箱地址

3. **获取 API Token**
   
   - 登录后访问: https://replicate.com/account/api-tokens
   - 点击 "Create token" 创建新的 API 密钥
   - 复制生成的 token（格式: `r8_xxxxx...`）

4. **配置环境变量**
   
   在项目根目录创建 `.env.local` 文件（如果没有），添加：
   
   ```env
   REPLICATE_API_TOKEN="r8_xxxxx..."
   ```

5. **验证配置**
   
   重启开发服务器：
   ```bash
   npm run dev
   ```
   
   访问网站并尝试生成视频。

### 💰 免费额度说明

- 每月免费 **$5** 积分
- 每次视频生成约消耗 **$0.10**（约 50 次/月）
- 积分每月重置
- 查看用量: https://replicate.com/account/billing

---

## 选项 2: Hugging Face API（完全免费）

### ✨ 特点
- **完全免费**，无额度限制
- 使用 Stable Video Diffusion 模型
- 有速率限制（每小时约 30-50 次）
- 首次使用时模型需要冷启动（约 20 秒）

### 📋 注册步骤

1. **访问 Hugging Face 官网**
   
   前往: https://huggingface.co/

2. **注册账号**
   
   - 点击右上角 "Sign Up" 按钮
   - 填写邮箱、用户名和密码
   - 验证邮箱地址

3. **创建 Access Token**
   
   - 登录后访问: https://huggingface.co/settings/tokens
   - 点击 "New token" 创建新的访问令牌
   - 名称: `sora-2-video-generator`（或任意名称）
   - 权限: 选择 **"Read"** 即可
   - 点击 "Generate token"
   - 复制生成的 token（格式: `hf_xxxxx...`）

4. **配置环境变量**
   
   在 `.env.local` 文件中添加：
   
   ```env
   HF_API_TOKEN="hf_xxxxx..."
   ```

5. **验证配置**
   
   重启开发服务器：
   ```bash
   npm run dev
   ```
   
   访问网站并尝试生成视频。

### ⚠️ 注意事项

- **冷启动**: 模型首次加载需要 20 秒左右
- **速率限制**: 每小时约 30-50 次请求
- **503 错误**: 如果遇到 "模型加载中" 错误，等待 20 秒后重试

---

## 🔧 完整配置示例

### 推荐配置（同时配置两个 API）

在 `.env.local` 文件中：

```env
# 优先使用 Replicate（质量最佳）
REPLICATE_API_TOKEN="r8_xxxxx..."

# 备选使用 Hugging Face（完全免费）
HF_API_TOKEN="hf_xxxxx..."
```

这样配置后：
- 系统会**优先使用 Replicate** 生成视频（质量更好）
- 如果 Replicate 失败或额度用完，会自动切换到 **Hugging Face**
- 如果两者都失败，会回退到**演示模式**

---

## 🧪 测试 API 配置

### 方法 1: 使用网站界面测试

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问 http://localhost:3000

3. 上传一张图片，输入运动描述，点击"生成视频"

4. 查看控制台日志：
   ```
   🎬 收到视频生成请求
   🔑 API 密钥状态: { hasReplicateToken: true, hasHFToken: true }
   📡 使用 Replicate API 生成视频...
   ✅ 视频生成成功
   ```

### 方法 2: 使用命令行测试

创建测试脚本 `test-api.js`：

```javascript
// 测试 Replicate API
async function testReplicate() {
  const token = process.env.REPLICATE_API_TOKEN
  
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
      input: {
        input_image: 'https://replicate.delivery/pbxt/example.jpg',
        motion_bucket_id: 127
      }
    }),
  })
  
  console.log('Replicate API 状态:', response.status)
  console.log('响应:', await response.json())
}

testReplicate()
```

运行测试：
```bash
node test-api.js
```

---

## ❓ 常见问题

### Q1: 为什么生成的视频是演示视频？

**A**: 检查以下几点：
1. 确认已配置 `REPLICATE_API_TOKEN` 或 `HF_API_TOKEN`
2. 确认已重启开发服务器
3. 查看浏览器控制台和终端日志

### Q2: Replicate API 提示 "Unauthorized" 错误

**A**: 
- 检查 API Token 是否正确复制（包括 `r8_` 前缀）
- 确认 token 未过期
- 在 Replicate 网站检查 token 状态

### Q3: Hugging Face 提示 "503 Service Unavailable"

**A**: 
- 这是正常现象，表示模型正在加载
- 等待 20 秒后重试
- 如果持续出现，可能是速率限制，稍后再试

### Q4: 两个 API 都配置了，使用哪个？

**A**: 
- 系统会**优先使用 Replicate**（质量更好）
- 只有当 Replicate 失败时才会切换到 Hugging Face

### Q5: 免费额度用完了怎么办？

**A**: 
- **Replicate**: 等到下个月重置，或升级到付费版
- **Hugging Face**: 完全免费，只需注意速率限制
- 如果两者都不可用，系统会自动切换到演示模式

---

## 🚀 下一步

配置完成后，您可以：

1. ✅ 测试图片转视频功能
2. ✅ 尝试不同的运动描述提示词
3. ✅ 调整分辨率和时长设置
4. ✅ 查看生成的视频质量

如有问题，请查看项目 README 或提交 Issue。

---

## 📚 相关链接

- **Replicate**
  - 官网: https://replicate.com/
  - 文档: https://replicate.com/docs
  - Stable Video Diffusion 模型: https://replicate.com/stability-ai/stable-video-diffusion

- **Hugging Face**
  - 官网: https://huggingface.co/
  - 文档: https://huggingface.co/docs/api-inference
  - Stable Video Diffusion 模型: https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt

- **Stable Video Diffusion**
  - 官方介绍: https://stability.ai/news/stable-video-diffusion-open-ai-video-model

