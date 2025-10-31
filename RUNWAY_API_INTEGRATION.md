# Runway API 集成完成报告

## 集成概况

✅ 已成功将网站从 Sora 2 API 迁移到 Runway Gen-3 API（通过 KIE AI 提供）

## 你的 API 密钥

```
KIE_API_KEY: 5daf0cdd41245797548d086a7e069079
```

**⚠️ 重要提醒**: 请妥善保管你的 API 密钥，切勿公开分享！

## API 端点配置

已配置以下端点：

- **基础 URL**: `https://api.kie.ai`
- **创建任务**: `/api/v1/runway/generate`
- **查询状态**: `/api/v1/runway/record-detail`

## 集成的功能

### 1. 文字生成视频 (Text-to-Video)
- 用户输入文字描述
- API 生成 5-10 秒的视频
- 支持分辨率: 720p
- 支持比例: 16:9 和 9:16

### 2. 图片生成视频 (Image-to-Video)
- 用户上传图片
- 输入运动描述
- API 基于图片生成动态视频
- 需要配置 IMGBB_API_KEY 用于图片上传

## API 请求格式

```typescript
{
  prompt: "视频描述",
  duration: 5 或 10,  // 秒
  quality: "720p",
  aspectRatio: "16:9" 或 "9:16",
  imageUrl: "可选的图片URL"  // 仅用于图生视频
}
```

## API 响应格式

### 创建任务响应
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "taskId": "任务ID"
  }
}
```

### 查询状态响应
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "state": "wait" | "queueing" | "generating" | "success" | "fail",
    "videoInfo": {
      "videoUrl": "视频URL",
      "imageUrl": "封面图URL"
    },
    "expireFlag": 0 | 1
  }
}
```

## 状态轮询机制

- **轮询间隔**: 2 秒
- **最大尝试次数**: 60 次（总计 2 分钟）
- **状态流程**: wait → queueing → generating → success/fail

## 如何测试

### 方法 1: 启动开发服务器

```bash
# 安装依赖（如果还没有安装）
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 方法 2: 构建并运行生产版本

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

## 测试步骤

### 测试文字生成视频

1. 打开网站首页
2. 选择 "文字生成视频" 模式
3. 输入描述，例如: "A serene sunset over the ocean with waves gently crashing"
4. 选择时长: 5 或 10 秒
5. 选择比例: 16:9 或 9:16
6. 点击 "生成视频"
7. 等待 API 处理（通常需要 30-120 秒）

### 测试图片生成视频

1. 打开网站首页
2. 选择 "图片生成视频" 模式
3. 上传一张图片
4. 输入运动描述，例如: "Camera slowly zooms in"
5. 选择参数并生成

## 代码修改总结

### 1. API 配置 (route.ts:70-76)
```typescript
KIE: {
  BASE_URL: 'https://api.kie.ai',
  CREATE_TASK_ENDPOINT: '/api/v1/runway/generate',
  GET_TASK_ENDPOINT: '/api/v1/runway/record-detail',
  DEFAULT_ASPECT_RATIO: '16:9',
}
```

### 2. 请求函数 (route.ts:327-419)
- 修改了 `generateWithKie` 函数以适配 Runway API 的请求格式
- 参数变更:
  - `model` → 移除（Runway API 不需要）
  - `aspect_ratio` → `aspectRatio`
  - `n_frames` → `duration` (数字格式)
  - `quality` 字段新增

### 3. 轮询函数 (route.ts:421-478)
- 修改了 `pollKieTask` 函数以适配 Runway API 的响应格式
- 状态值变更: `waiting` → `wait`, `queueing`, `generating`
- 结果字段变更: `resultUrls` → `videoInfo.videoUrl`

### 4. 模型显示名称 (route.ts:675, 686)
- "Sora 2 (Kie.ai)" → "Runway Gen-3 (Kie.ai)"

### 5. 环境变量文档
- 更新了 `.env` 和 `.env.example` 中的注释
- 添加了 Runway API 文档链接

## 注意事项

1. **API 限制**
   - HTTP 401: API 密钥无效或缺失
   - HTTP 402: 账户余额不足
   - HTTP 429: 请求频率超限

2. **视频存储**
   - 生成的视频会在 14 天后自动删除
   - 建议及时下载重要视频

3. **图片要求**（图生视频）
   - 需要配置 `IMGBB_API_KEY`
   - 支持格式: JPEG, PNG, WebP, BMP
   - 最大大小: 10MB

4. **推荐配置**
   - 生产环境建议实现 webhook 回调代替轮询
   - 建议设置错误监控和日志记录

## 下一步

如需其他功能或有任何问题，请参考：
- Runway API 官方文档: https://docs.kie.ai/cn/runway-api/quickstart
- KIE AI API 密钥管理: https://kie.ai/api-key

## 技术支持

如遇到问题，可检查：
1. API 密钥是否正确配置
2. 账户余额是否充足
3. 网络连接是否正常
4. 浏览器控制台和服务器日志中的错误信息
