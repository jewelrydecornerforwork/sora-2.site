# 视频生成功能修复报告

## 问题诊断

在检查项目的文本转视频和图像转视频功能时，发现了以下**关键问题**：

### 主要问题

1. **错误的API模型名称**
   - **问题**: 代码中使用了 `sora-2-text-to-video` 和 `sora-2-image-to-video`
   - **事实**: Kie.ai **根本没有 Sora 2 API**
   - **实际**: Kie.ai 提供的是 **Google Veo 3.1** API

2. **错误的API端点**
   - **原来**: `/api/v1/jobs/createTask` 和 `/api/v1/jobs/recordInfo`
   - **正确**: `/api/v1/veo/generate` 和 `/api/v1/veo/record-info`

3. **错误的请求体格式**
   - **原来**: 使用了 `model`, `input.prompt`, `input.aspect_ratio`, `input.n_frames` 等字段
   - **正确**: 使用 `prompt`, `model`, `generationType`, `aspectRatio`, `enableTranslation` 等字段

4. **错误的响应解析**
   - **原来**: 检查 `result.code === 200`, `result.state`, `result.resultJson.resultUrls`
   - **正确**: 检查 `result.code === 0`, `result.successFlag`, `result.data.resultUrls`

## 修复内容

### 1. 更新 API 配置 (`app/api/generate-video/route.ts:70-77`)

```typescript
// Kie.ai API (Veo 3.1)
KIE: {
  BASE_URL: 'https://api.kie.ai',
  CREATE_TASK_ENDPOINT: '/api/v1/veo/generate',
  GET_TASK_ENDPOINT: '/api/v1/veo/record-info',
  DEFAULT_ASPECT_RATIO: '16:9',
  DEFAULT_MODEL: 'veo3_fast', // Options: 'veo3' (quality) or 'veo3_fast' (speed)
},
```

### 2. 重写 `generateWithKie` 函数 (`app/api/generate-video/route.ts:328-422`)

**主要改动**:
- 使用正确的 `generationType`: `TEXT_2_VIDEO` 或 `IMAGE_2_VIDEO`
- 直接传递 `prompt`, `model`, `aspectRatio` 等参数
- 移除错误的 `input` 包装层
- 添加 `enableTranslation: true` 支持自动翻译
- 修正成功响应检查: `result.code === 0` (不是 200)

### 3. 重写 `pollKieTask` 函数 (`app/api/generate-video/route.ts:424-489`)

**主要改动**:
- 使用 `successFlag` 而不是 `state` 字段
  - `0`: 生成中
  - `1`: 成功
  - `2` 或 `3`: 失败
- 正确解析 `result.data.resultUrls` (可能是JSON字符串)
- 改进错误处理和日志输出

### 4. 更新模型标识 (`app/api/generate-video/route.ts:686, 697`)

```typescript
// 文本转视频
usedModel = 'Google Veo 3.1 (Kie.ai) - Text-to-Video'

// 图像转视频
usedModel = 'Google Veo 3.1 (Kie.ai) - Image-to-Video'
```

### 5. 更新文档 (`KIE_API_SETUP.md`)

- 修正标题和描述，明确说明使用的是 **Veo 3.1** 而不是 Sora 2
- 更新所有API端点和参数说明
- 添加正确的请求/响应示例
- 添加更新日志说明重要修正

## 验证步骤

修复完成后，建议按以下步骤测试：

### 1. 检查环境变量配置

```bash
# 确保 .env.local 文件包含有效的 API keys
KIE_API_KEY=kie_your_actual_api_key_here
IMGBB_API_KEY=your_imgbb_api_key_here
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 测试文本转视频

1. 访问 http://localhost:3000
2. 选择 "Text to Video" 模式
3. 输入测试提示词，例如: "A cute cat playing with a ball in a sunny garden"
4. 点击生成按钮
5. 查看浏览器开发者工具的Network和Console
6. 查看终端日志输出

### 4. 测试图像转视频

1. 选择 "Image to Video" 模式
2. 上传一张测试图片
3. 输入运动描述，例如: "Camera slowly zooms in, the subject smiles"
4. 点击生成按钮
5. 检查图片是否成功上传到imgbb
6. 检查视频是否成功生成

### 5. 检查日志输出

正常的日志流程应该是：

```
📡 Generating text-to-video with Kie.ai Veo 3.1 API...
📝 Request body: { ... }
📡 Sending request to: https://api.kie.ai/api/v1/veo/generate
📊 Response status: 200 OK
📊 Kie API response: { code: 0, msg: "success", data: { taskId: "..." } }
⏳ Task ID: ...
🔄 Starting to poll task: ...
📡 Polling attempt 1/60 for task ...
⏳ Video is still generating (1/60)...
...
✅ Video generated successfully: https://...
```

## 常见错误排查

### 错误 1: "Kie API error: Invalid model"
- **原因**: API key 不支持 Veo 3.1 模型
- **解决**: 确认您的 Kie.ai 账户有 Veo 3.1 的访问权限

### 错误 2: "HTTP 401: Unauthorized"
- **原因**: API key 无效或格式错误
- **解决**: 检查 `.env.local` 中的 `KIE_API_KEY` 是否正确

### 错误 3: "Task timeout"
- **原因**: 视频生成时间超过2分钟
- **解决**: Veo 3.1 通常需要30-90秒，如果经常超时，可以增加 `POLLING.MAX_ATTEMPTS`

### 错误 4: "Failed to upload image to imgbb"
- **原因**: imgbb API key 无效或图片过大
- **解决**: 检查 `IMGBB_API_KEY` 并确保图片小于10MB

## API 参考

### Kie.ai Veo 3.1 文档
- 官网: https://kie.ai
- 文档: https://docs.kie.ai/veo3-api

### 请求示例

**文本转视频**:
```bash
curl -X POST https://api.kie.ai/api/v1/veo/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over the ocean",
    "model": "veo3_fast",
    "generationType": "TEXT_2_VIDEO",
    "aspectRatio": "16:9",
    "enableTranslation": true
  }'
```

**图像转视频**:
```bash
curl -X POST https://api.kie.ai/api/v1/veo/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Camera slowly pans left to right",
    "model": "veo3_fast",
    "generationType": "IMAGE_2_VIDEO",
    "imageUrls": ["https://example.com/image.jpg"],
    "aspectRatio": "16:9",
    "enableTranslation": true
  }'
```

**查询任务状态**:
```bash
curl -X GET "https://api.kie.ai/api/v1/veo/record-info?taskId=YOUR_TASK_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## 总结

通过本次修复，项目现在使用正确的 **Google Veo 3.1 API**，而不是不存在的 Sora 2 API。所有API端点、请求格式和响应解析都已更正。用户现在应该能够成功使用文本转视频和图像转视频功能。

## 修复日期
2025-01-30

## 修复文件
- `app/api/generate-video/route.ts` - 核心API逻辑
- `KIE_API_SETUP.md` - API集成文档
- `FIX_REPORT.md` - 本修复报告
