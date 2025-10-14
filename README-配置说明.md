# 🚀 API 配置说明 - 三种方式任选其一

## 问题：生成不了视频

**原因**：缺少 AI API 配置，系统运行在演示模式
**解决**：配置免费的 API 密钥（以下三种方式任选其一）

---

## ⭐ 方式一：自动配置脚本（最简单，推荐）

### Windows 用户（推荐）

1. **双击运行 `setup-api.bat` 文件**
   - 位置：项目根目录
   - 或在命令行运行：
     ```bash
     setup-api.bat
     ```

2. **按提示选择选项**：
   - 选项 1：配置 Replicate API（推荐）
   - 选项 2：配置 Hugging Face API（免费）
   - 选项 3：同时配置两个（最佳）
   - 选项 4：查看当前配置状态
   - 选项 5：手动编辑配置文件

3. **按照脚本提示操作**即可完成配置

### Linux/Mac 用户

```bash
bash setup-api.sh
```

---

## 📝 方式二：手动编辑配置文件

### 第 1 步：获取 API Token

#### 选项 A：Replicate（推荐）
1. 访问：https://replicate.com/
2. 注册账号（可用 GitHub 登录）
3. 访问：https://replicate.com/account/api-tokens
4. 点击 "Create token"
5. 复制 Token（格式：`r8_xxxxx...`）

#### 选项 B：Hugging Face（免费）
1. 访问：https://huggingface.co/
2. 注册账号
3. 访问：https://huggingface.co/settings/tokens
4. 点击 "New token"
5. 权限选择 "Read"
6. 复制 Token（格式：`hf_xxxxx...`）

### 第 2 步：编辑配置文件

1. **打开 `.env.local` 文件**
   - 位置：`C:\Users\SJM\Desktop\JEW\sora-2.site\.env.local`
   - 使用记事本或 VS Code 打开

2. **找到对应的行**：
   ```env
   REPLICATE_API_TOKEN="r8_..."
   HF_API_TOKEN="hf_..."
   ```

3. **替换为您的真实 Token**：
   ```env
   # 如果使用 Replicate
   REPLICATE_API_TOKEN="r8_BpLkzf9QXmN3jH5vR2tY8wC1dF6gK4sA7pL9"
   
   # 如果使用 Hugging Face
   HF_API_TOKEN="hf_MnKjHgFdSaQwErTyUiOpLkJhGfDsAzXcVbNm"
   
   # 推荐同时配置两个
   REPLICATE_API_TOKEN="r8_BpLkzf9QXmN3jH5vR2tY8wC1dF6gK4sA7pL9"
   HF_API_TOKEN="hf_MnKjHgFdSaQwErTyUiOpLkJhGfDsAzXcVbNm"
   ```

4. **保存文件**（Ctrl+S）

---

## 💻 方式三：使用命令行（高级用户）

### Windows PowerShell

```powershell
# 配置 Replicate
(Get-Content .env.local) -replace 'REPLICATE_API_TOKEN="r8_..."', 'REPLICATE_API_TOKEN="您的Token"' | Set-Content .env.local

# 配置 Hugging Face
(Get-Content .env.local) -replace 'HF_API_TOKEN="hf_..."', 'HF_API_TOKEN="您的Token"' | Set-Content .env.local
```

### Linux/Mac

```bash
# 配置 Replicate
sed -i 's/REPLICATE_API_TOKEN="r8_..."/REPLICATE_API_TOKEN="您的Token"/' .env.local

# 配置 Hugging Face
sed -i 's/HF_API_TOKEN="hf_..."/HF_API_TOKEN="您的Token"/' .env.local
```

---

## ⚠️ 配置后必须做的事

### 1. 重启开发服务器

配置完成后，**必须重启**才能生效：

```bash
# 1. 停止当前服务器（在运行 npm run dev 的终端按 Ctrl+C）
# 2. 重新启动
npm run dev
```

### 2. 验证配置

启动后查看终端日志，应该看到：

```
🔑 API 密钥状态: { hasReplicateToken: true, hasHFToken: false }
```

或

```
🔑 API 密钥状态: { hasReplicateToken: true, hasHFToken: true }
```

### 3. 测试视频生成

1. 访问 http://localhost:3000
2. 上传一张图片
3. 输入运动描述，例如：
   ```
   一位女士在海滩上行走，夕阳西下，海浪轻柔拍打
   ```
4. 点击 "Generate Video"
5. 等待 30-60 秒
6. 查看生成的视频

---

## 📊 API 对比

| 服务 | 免费额度 | 质量 | 速度 | 限制 | 推荐 |
|------|---------|------|------|------|------|
| **Replicate** | 每月 $5（约50次） | ⭐⭐⭐⭐⭐ | 快（30-60秒） | 每月重置 | ✅ 首选 |
| **Hugging Face** | 完全免费 | ⭐⭐⭐⭐ | 中（首次慢） | 速率限制 | ✅ 备选 |

**最佳配置**：同时配置两个，系统会优先使用 Replicate

---

## ❓ 常见问题

### Q1：配置后还是生成演示视频？
**A**：
- 检查 Token 是否正确填入（包含引号）
- 确认是否重启了开发服务器
- 查看终端日志中的 API 密钥状态

### Q2：Token 格式是什么样的？
**A**：
- Replicate：以 `r8_` 开头，例如 `r8_BpLkzf9QX...`
- Hugging Face：以 `hf_` 开头，例如 `hf_MnKjHgFdS...`

### Q3：提示 "Unauthorized" 错误？
**A**：
- Token 可能复制错误或不完整
- 重新复制完整的 Token（包括前缀）
- 检查 Token 是否在引号内

### Q4：Hugging Face 提示 "503" 错误？
**A**：
- 这是正常现象（模型冷启动）
- 等待 20 秒后重试

### Q5：我应该选择哪个 API？
**A**：
- **个人开发/测试**：Replicate（质量最好）
- **大量使用**：同时配置两个
- **预算有限**：Hugging Face（完全免费）

---

## 🎉 配置成功的标志

✅ 终端显示：`hasReplicateToken: true` 或 `hasHFToken: true`
✅ 生成的视频不是演示视频（`demo-video.mp4`）
✅ 终端显示：`✅ 视频生成成功`
✅ 生成时间约 30-60 秒

---

## 📚 相关文档

- **详细配置指南**：`FREE_API_SETUP.md`
- **Replicate 配置**：`快速配置-Replicate.md`
- **项目说明**：`README.md`

---

**配置有任何问题，请查看终端错误日志或联系支持！** 🆘

