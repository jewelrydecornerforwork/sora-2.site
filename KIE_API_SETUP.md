# Kie.ai Sora 2 API 集成指南

本项目已完整集成 Kie.ai 的 **Sora 2 API**（OpenAI 的视频生成模型），支持文本生成视频和图片生成视频两种模式。

## 快速开始

### 1. 获取 API Keys

#### Kie.ai API Key（必需）
1. 访问 [Kie.ai](https://kie.ai)
2. 注册并登录账号
3. 进入 API 密钥管理页面
4. 创建新的 API Key
5. 复制你的 API Key（格式：`kie_xxxxx...` 或类似）
6. **重要**：充值账户以获得 credits

#### imgbb API Key（图片转视频必需）
1. 访问 [imgbb API](https://api.imgbb.com/)
2. 注册账号
3. 获取免费的 API Key
4. 每月可免费上传 5000 张图片

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# Kie.ai API Key（必需 - 需要充值才能使用）
KIE_API_KEY=your_actual_kie_api_key_here

# imgbb API Key（图片转视频功能必需）
IMGBB_API_KEY=your_imgbb_api_key_here

# 其他可选 API（如需使用其他模型）
REPLICATE_API_TOKEN=your_replicate_token_here
HF_API_TOKEN=your_huggingface_token_here
```

### 3. 充值账户

**重要**：Sora 2 API 需要账户余额才能使用。

1. 访问 https://kie.ai 登录
2. 进入账户余额/充值页面
3. 购买 credits
4. 定价：约 $0.03 per 10秒视频（具体价格见官网）

### 4. 启动项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 即可使用。

## API 工作流程

### 文本生成视频（Text-to-Video）

1. 用户输入文字描述
2. 后端调用 Kie.ai Sora 2 API 创建任务
3. 获取 taskId 并轮询任务状态
4. 任务完成后返回视频 URL
5. 前端显示生成的视频

### 图片生成视频（Image-to-Video）

1. 用户上传图片并输入运动描述
2. 后端先将图片上传到 imgbb 获取公网 URL
3. 使用图片 URL 调用 Kie.ai Sora 2 API 创建任务
4. 获取 taskId 并轮询任务状态
5. 任务完成后返回视频 URL
6. 前端显示生成的视频

## API 端点说明

### 创建任务
- 端点：`POST https://api.kie.ai/api/v1/jobs/createTask`
- 请求头：`Authorization: Bearer YOUR_API_KEY`
- Content-Type: `application/json`

#### 文本生成视频请求体：
```json
{
  "model": "sora-2-text-to-video",
  "input": {
    "prompt": "描述你想要的视频内容",
    "aspect_ratio": "landscape",
    "n_frames": "10",
    "remove_watermark": true
  }
}
```

#### 图片生成视频请求体：
```json
{
  "model": "sora-2-image-to-video",
  "input": {
    "prompt": "描述你想要的运动效果",
    "image_urls": ["https://公网可访问的图片URL"],
    "aspect_ratio": "landscape",
    "n_frames": "10",
    "remove_watermark": true
  }
}
```

### 查询任务状态
- 端点：`GET https://api.kie.ai/api/v1/jobs/recordInfo?taskId={taskId}`
- 请求头：`Authorization: Bearer YOUR_API_KEY`

成功响应示例：
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "xxx",
    "state": "success",
    "resultUrls": ["https://视频URL"]
  }
}
```

## 参数说明

### model（模型选择）
- `sora-2-text-to-video`: 文本生成视频
- `sora-2-image-to-video`: 图片生成视频

### aspect_ratio（画面比例）
- `landscape`: 横屏（16:9）
- `portrait`: 竖屏（9:16）

### n_frames（视频时长）
- `"10"`: 10 秒
- `"15"`: 15 秒

### remove_watermark（去除水印）
- `true`: 去除水印（推荐）
- `false`: 保留水印

### state（任务状态 - 仅用于轮询）
- `waiting`: 生成中
- `success`: 成功
- `fail`: 失败

### code（API响应代码）
- `200`: 请求成功
- `402`: 余额不足，需要充值
- `401`: 未授权（API key 无效）
- 其他: 请求失败

## 注意事项

1. **API Key 安全**：
   - 务必将 API Key 配置在 `.env.local` 文件中
   - 不要将 `.env.local` 文件提交到 git
   - API Key 只在后端使用，不会暴露到前端

2. **账户余额**：
   - 使用前必须充值账户
   - 余额不足会返回 402 错误
   - 每次生成都会消耗 credits

3. **图片要求**：
   - 图片必须是公网可访问的 URL
   - 本项目使用 imgbb 自动上传图片
   - 支持的格式：JPEG, PNG, WebP, BMP
   - 最大文件大小：10MB

4. **费用说明**：
   - Sora 2: 约 $0.03 per 10秒视频
   - 比 OpenAI 官方价格便宜约 60%
   - imgbb 免费版每月 5000 次上传

5. **错误处理**：
   - 如果返回 402：需要充值
   - 如果返回 401：检查 API Key
   - 如果任务失败：查看 failMsg 字段
   - 查看后端日志获取详细错误信息

## 故障排查

### 1. 错误：余额不足
```json
{"code": 402, "msg": "The current credits are insufficient. Please top up."}
```
**解决**：访问 https://kie.ai 充值账户

### 2. 视频生成失败
- 检查 KIE_API_KEY 是否正确配置
- 查看后端日志中的错误信息
- 确认账户有足够余额

### 3. 图片上传失败
- 检查 IMGBB_API_KEY 是否正确配置
- 确认图片大小不超过 10MB
- 检查图片格式是否支持

### 4. 任务超时
- 默认超时时间为 2 分钟（60 次轮询 × 2 秒）
- 可在 `API_CONFIG.POLLING` 中调整
- Sora 2 生成通常需要 30-90 秒

## 技术支持

- Kie.ai 官网：https://kie.ai
- Kie.ai Sora 2 页面：https://kie.ai/sora-2
- imgbb API：https://api.imgbb.com/
- 项目 Issues：请在 GitHub 仓库提交问题

## 更新日志

- 2025-10-30: 恢复 Sora 2 API 集成
  - ✅ 确认 Sora 2 API 存在且可用
  - ✅ 端点：`/api/v1/jobs/createTask` 和 `/api/v1/jobs/recordInfo`
  - ✅ 修复响应解析逻辑
  - ✅ 添加余额不足错误处理
  - ✅ 更新所有文档
