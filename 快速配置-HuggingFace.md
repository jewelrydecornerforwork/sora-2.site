# 🤗 Hugging Face API 配置指南

## ✨ Hugging Face 优势

- ✅ **完全免费**，无需信用卡
- ✅ 无限次数使用（有速率限制）
- ✅ 使用 Stable Video Diffusion 模型
- ✅ 注册简单，5 分钟搞定
- ⚠️ 首次使用模型需要冷启动（约 20 秒）
- ⚠️ 每小时约 30-50 次请求限制

---

## 📋 配置步骤（5 分钟）

### 第一步：注册 Hugging Face 账号

1. **打开浏览器访问**：
   ```
   https://huggingface.co/
   ```

2. **点击右上角 "Sign Up" 按钮**

3. **填写注册信息**：
   - Email（邮箱）
   - Username（用户名）
   - Password（密码，至少 8 位）

4. **验证邮箱**：
   - 检查您的邮箱
   - 点击验证链接
   - 完成验证

---

### 第二步：创建 Access Token

1. **登录后，访问以下链接**：
   ```
   https://huggingface.co/settings/tokens
   ```
   
   或者：
   - 点击右上角头像
   - 选择 "Settings"
   - 左侧菜单选择 "Access Tokens"

2. **创建新 Token**：
   - 点击 "**New token**" 按钮
   - Name（名称）：填写 `sora-2-video-generator`（或任意名称）
   - Role（权限）：选择 **"Read"**（只读权限即可）
   - 点击 "**Generate a token**" 按钮

3. **复制 Token**：
   - Token 格式类似：`hf_MnKjHgFdSaQwErTyUiOpLkJhGfDsAzXcVbNm`
   - ⚠️ **重要**：完整复制，包括 `hf_` 前缀
   - ⚠️ **注意**：Token 只显示一次，请立即复制保存

---

### 第三步：配置到项目

#### 方式 A：使用自动配置脚本（推荐）

1. **双击运行** `setup-api.bat`

2. **选择选项 2**（Hugging Face API）

3. **粘贴您的 Token**：
   ```
   请粘贴您的 Hugging Face Token: hf_MnKjHgFdSaQwErTyUiOpLkJhGfDsAzXcVbNm
   ```

4. **完成！** 脚本会自动配置

#### 方式 B：手动编辑配置文件

1. **打开项目根目录的 `.env.local` 文件**
   - 位置：`C:\Users\SJM\Desktop\JEW\sora-2.site\.env.local`
   - 使用记事本、VS Code 或任何文本编辑器

2. **找到这一行**：
   ```env
   HF_API_TOKEN="hf_..."
   ```

3. **替换为您的真实 Token**：
   ```env
   HF_API_TOKEN="hf_MnKjHgFdSaQwErTyUiOpLkJhGfDsAzXcVbNm"
   ```
   ⚠️ 注意：保留双引号

4. **保存文件**（按 Ctrl+S）

---

### 第四步：重启开发服务器

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
   🔑 API 密钥状态: { hasReplicateToken: false, hasHFToken: true }
   ```

---

## ✅ 验证配置成功

### 测试视频生成

1. **访问** http://localhost:3000

2. **上传一张图片**（任意图片都可以）

3. **输入运动描述**，例如：
   ```
   一位女士在海滩上行走，夕阳西下，海浪轻柔拍打沙滩
   ```

4. **点击 "Generate Video"**

5. **等待生成**：
   - 首次使用：约 40-60 秒（模型冷启动）
   - 之后使用：约 20-30 秒

6. **查看终端日志**：
   ```
   🎬 收到视频生成请求
   🔑 API 密钥状态: { hasReplicateToken: false, hasHFToken: true }
   📡 使用 Hugging Face API 生成视频...
   ✅ 视频生成成功
   ```

7. **如果生成的不是演示视频，配置成功！** ✅

---

## 🔍 配置检查清单

完成以下检查确保配置正确：

- [ ] Token 以 `hf_` 开头
- [ ] Token 完整复制（长度约 37 个字符）
- [ ] Token 在双引号内：`HF_API_TOKEN="hf_xxxxx"`
- [ ] 保存了 `.env.local` 文件
- [ ] 重启了开发服务器
- [ ] 终端显示 `hasHFToken: true`
- [ ] 生成的不是演示视频（`demo-video.mp4`）

---

## ⚠️ 常见问题与解决

### Q1: 提示 "503 Service Unavailable" 错误

**原因**：模型正在冷启动（这是正常现象）

**解决**：
- 等待 20-30 秒后重试
- 首次使用时模型需要加载
- 之后速度会变快

### Q2: 提示 "Unauthorized" 错误

**原因**：Token 无效或格式错误

**解决**：
1. 检查 Token 是否包含 `hf_` 前缀
2. 确认 Token 完整复制（不要有空格）
3. 检查 Token 是否在双引号内
4. 重新生成一个新的 Token

### Q3: 配置后还是生成演示视频

**原因**：服务器未重启或配置错误

**解决**：
1. 检查 `.env.local` 文件是否保存
2. 确认 Token 格式正确
3. 重启开发服务器（Ctrl+C 后重新 `npm run dev`）
4. 查看终端日志中的 API 密钥状态

### Q4: 视频生成很慢

**正常速度**：
- 首次使用：40-60 秒（模型冷启动）
- 之后使用：20-30 秒

**如果超过 2 分钟**：
- 检查网络连接
- 查看终端是否有错误
- 刷新页面重试

### Q5: 提示速率限制（Rate Limit）

**原因**：短时间内请求过多

**解决**：
- 等待几分钟后重试
- Hugging Face 免费服务有速率限制（约 30-50 次/小时）
- 如需大量使用，可配置 Replicate 作为主要 API

---

## 💡 优化建议

### 同时配置 Replicate + Hugging Face（推荐）

为了获得最佳体验，建议同时配置两个 API：

```env
# 优先使用 Replicate（质量更好）
REPLICATE_API_TOKEN="r8_xxxxx..."

# 备用 Hugging Face（完全免费）
HF_API_TOKEN="hf_xxxxx..."
```

**工作原理**：
- 系统优先使用 Replicate（质量最佳）
- Replicate 额度用完时自动切换到 Hugging Face
- 双保险，确保服务稳定

### 查看 Hugging Face 使用情况

访问：https://huggingface.co/settings/tokens
- 查看 Token 使用记录
- 管理和删除旧 Token

---

## 📊 Hugging Face vs Replicate

| 特性 | Hugging Face | Replicate |
|------|--------------|-----------|
| 费用 | 完全免费 | 每月 $5 免费 |
| 质量 | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐⭐⭐ 最佳 |
| 速度 | 中等（首次慢） | 快 |
| 限制 | 速率限制 | 每月 50 次 |
| 注册 | 简单 | 简单 |
| 推荐 | ✅ 备选 | ✅ 首选 |

**建议**：
- 个人测试：Hugging Face（免费）
- 生产使用：Replicate（质量更好）
- 最佳方案：同时配置两个

---

## 🔐 安全提醒

⚠️ **重要**：
- 不要分享您的 Token 给任何人
- 不要将 `.env.local` 提交到 Git（已自动忽略）
- 如果 Token 泄露，立即删除并重新生成
- Token 权限选择 "Read" 即可，不要给过高权限

---

## 📚 相关资源

### Hugging Face 官方链接

- **官网**：https://huggingface.co/
- **文档**：https://huggingface.co/docs
- **Token 管理**：https://huggingface.co/settings/tokens
- **使用的模型**：https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt

### 项目相关文档

- **完整配置指南**：`FREE_API_SETUP.md`
- **配置说明**：`README-配置说明.md`
- **项目说明**：`README.md`

---

## 🎉 配置完成！

恭喜！您已经成功配置了 Hugging Face API！

**现在您可以：**
1. ✅ 无限次免费生成视频
2. ✅ 不需要信用卡
3. ✅ 享受 AI 视频生成的乐趣

**接下来：**
- 上传您喜欢的图片
- 输入创意的运动描述
- 生成精彩的 AI 视频！

**需要帮助？**
- 查看终端错误日志
- 查看浏览器控制台
- 参考本文档的常见问题部分

---

**祝您使用愉快！** 🚀

