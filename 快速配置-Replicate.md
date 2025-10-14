# 🚀 Replicate API 快速配置指南

## 第一步：注册 Replicate 账号

1. **打开浏览器，访问**：
   ```
   https://replicate.com/
   ```

2. **点击右上角 "Sign Up" 按钮**

3. **选择注册方式**（推荐使用 GitHub）：
   - 使用 GitHub 账号登录（最快）
   - 或使用邮箱注册

4. **验证邮箱**（如果使用邮箱注册）

---

## 第二步：获取 API Token

1. **登录后，访问以下链接**：
   ```
   https://replicate.com/account/api-tokens
   ```

2. **点击 "Create token" 按钮**

3. **复制生成的 Token**
   - Token 格式类似：`r8_BpLkzf9QXmN3jH5vR2tY8wC1dF6gK4sA7pL9`
   - ⚠️ 注意：完整复制，包括 `r8_` 前缀

---

## 第三步：配置到项目

### 方式 A：手动编辑配置文件

1. **打开项目根目录的 `.env.local` 文件**
   - 位置：`C:\Users\SJM\Desktop\JEW\sora-2.site\.env.local`
   - 使用记事本、VS Code 或任何文本编辑器打开

2. **找到这一行**：
   ```env
   REPLICATE_API_TOKEN="r8_..."
   ```

3. **替换为您的真实 Token**：
   ```env
   REPLICATE_API_TOKEN="r8_BpLkzf9QXmN3jH5vR2tY8wC1dF6gK4sA7pL9"
   ```
   ⚠️ 注意：保留双引号

4. **保存文件**（按 Ctrl+S）

### 方式 B：使用命令行快速配置（更简单）

在项目目录下运行：

```bash
# Windows PowerShell
(Get-Content .env.local) -replace 'REPLICATE_API_TOKEN="r8_..."', 'REPLICATE_API_TOKEN="您的Token"' | Set-Content .env.local

# 或者使用 WSL/Linux
sed -i 's/REPLICATE_API_TOKEN="r8_..."/REPLICATE_API_TOKEN="您的Token"/' .env.local
```

---

## 第四步：重启开发服务器

配置完成后，**必须重启服务器**才能生效：

1. **停止当前服务器**
   - 在终端按 `Ctrl + C`

2. **重新启动**
   ```bash
   npm run dev
   ```

3. **查看启动日志**
   应该看到：
   ```
   🔑 API 密钥状态: { hasReplicateToken: true, hasHFToken: false }
   ```

---

## ✅ 验证配置成功

1. 访问 http://localhost:3000
2. 上传一张图片
3. 输入运动描述
4. 点击 "Generate Video"
5. 等待 30-60 秒
6. 如果看到真实的 AI 生成视频（不是演示视频），配置成功！✅

---

## 💰 免费额度说明

- **每月免费 $5 积分**
- 每次视频生成约消耗 **$0.10**
- 大约可以生成 **50 次视频/月**
- 积分每月 1 号重置
- 查看用量：https://replicate.com/account/billing

---

## ❓ 常见问题

### Q：Token 在哪里找？
A：登录后访问 https://replicate.com/account/api-tokens

### Q：Token 格式是什么样的？
A：以 `r8_` 开头，后面跟一长串字母数字

### Q：配置后还是演示视频？
A：检查是否重启了服务器，Token 是否包含引号

### Q：提示 "Unauthorized" 错误？
A：Token 可能复制错误，重新复制完整的 Token

---

**配置完成！享受 AI 视频生成吧！** 🎉

