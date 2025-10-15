# Kie.ai Sora 2 API 配置指南

## 📝 快速开始

本项目已集成 **Kie.ai Sora 2 API**，这是目前性价比最高的 OpenAI Sora 2 视频生成 API。

## 🔑 获取 API Key

### 步骤 1：注册账号
访问 [https://kie.ai/sora-2](https://kie.ai/sora-2) 注册账号

### 步骤 2：获取 API Key
1. 登录后进入仪表板：https://kie.ai/dashboard
2. 找到 "API Keys" 或 "Credentials" 部分
3. 创建一个新的 API Key
4. 复制生成的 API Key（格式类似：`kie_...` 或其他格式）

### 步骤 3：配置到项目
打开 `.env.local` 文件，替换以下行：

```bash
KIE_API_KEY="你的真实API密钥"
```

例如：
```bash
KIE_API_KEY="kie_abc123def456ghi789"
```

## 💰 价格说明

- **单价**: $0.15 / 10秒视频
- **带音频**: 是
- **无水印**: 是
- **质量**: OpenAI Sora 2 级别 ⭐⭐⭐⭐⭐

## 🚀 测试 API

配置完成后，运行以下命令测试：

```bash
# 启动开发服务器
npm run dev

# 在浏览器中打开
http://localhost:3000
```

上传一张图片，输入运动描述，点击"Generate Video"即可开始生成。

## 🔧 API 优先级

系统会按以下顺序尝试 API：

1. **Kie.ai Sora 2** （优先，质量最高）
2. **Replicate** （备选，需要有效 Token）
3. **Hugging Face** （免费备选）
4. **演示模式** （无 API 时使用）

## 📚 API 功能

### 支持的参数
- `image`: 输入图片（Base64 格式）
- `prompt`: 运动描述文本
- `duration`: 视频时长（5秒 / 10秒）
- `resolution`: 分辨率（480p / 720p / 1080p）
- `aspectRatio`: 宽高比（16:9）

### 响应格式
```json
{
  "success": true,
  "videoUrl": "https://...",
  "model": "Sora 2 (Kie.ai)",
  "creditsUsed": 1,
  "message": "视频生成成功！"
}
```

## ⚠️ 注意事项

1. **API Key 安全**：
   - 不要将 `.env.local` 文件提交到 Git
   - 不要分享你的 API Key

2. **费用控制**：
   - Kie.ai 按使用量付费
   - 建议设置账户预算限制

3. **测试建议**：
   - 先用小额充值测试
   - 确认功能正常后再正式使用

## 🐛 故障排查

### 问题：提示"演示模式"
**原因**：API Key 未配置或配置错误

**解决**：
1. 检查 `.env.local` 中的 `KIE_API_KEY` 是否正确
2. 确保没有引号内的占位符（如 `"kie_..."`）
3. 重启开发服务器：`npm run dev`

### 问题：API 调用失败
**可能原因**：
- API Key 无效或过期
- 账户余额不足
- 网络连接问题

**解决**：
1. 检查 Kie.ai 仪表板确认 API Key 状态
2. 查看开发服务器的错误日志
3. 确认账户有足够余额

## 📞 支持

- **Kie.ai 官方文档**: https://docs.kie.ai/
- **Kie.ai 客服**: 24/7 在线支持
- **项目 Issues**: 在 GitHub 上提交问题

---

**配置完成后即可开始使用高质量的 AI 视频生成服务！🎉**
