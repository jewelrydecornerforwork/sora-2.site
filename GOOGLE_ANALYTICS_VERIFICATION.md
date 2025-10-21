# Google Analytics 验证指南

## 📌 重要说明

**为什么本地检测不到？**
- 你目前在 `localhost:3002` 开发环境
- Google Analytics 在检查 `sora-2.site` 生产域名
- 这是正常的！代码已正确添加

## ✅ 当前配置状态

### 已完成的设置

1. **Google Analytics 代码已添加**
   - 位置：`app/layout.tsx`
   - 跟踪 ID：`G-NDLZQ2HE5X`
   - 状态：✅ 已集成

2. **环境变量已配置**
   - `.env.local`: `NEXT_PUBLIC_GA_ID=G-NDLZQ2HE5X`
   - 使用环境变量，便于管理

## 🔍 如何验证（3种方法）

### 方法 1：浏览器开发者工具（本地也可验证）

1. 打开你的网站（任何环境）
2. 按 F12 打开开发者工具
3. 进入 **Network（网络）** 标签
4. 刷新页面
5. 在过滤器中搜索 `google-analytics` 或 `gtag`
6. 应该看到以下请求：
   ```
   ✅ gtag/js?id=G-NDLZQ2HE5X
   ✅ collect?v=1&...
   ```

### 方法 2：控制台检查（本地也可验证）

1. 打开浏览器控制台（F12 → Console）
2. 输入以下命令：
   ```javascript
   console.log(window.dataLayer)
   ```
3. 应该看到数组输出，包含 GA 配置

### 方法 3：Google Analytics 实时报告（需要生产环境）

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 选择属性：G-NDLZQ2HE5X
3. 进入 **报告** → **实时** → **概览**
4. 访问你的生产网站 `https://sora-2.site`
5. 应该立即看到访问者数据

## 🚀 部署到生产环境

### Vercel 部署步骤

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Add Google Analytics"
   git push origin main
   ```

2. **在 Vercel 中配置环境变量**
   - 进入 Vercel 项目设置
   - Settings → Environment Variables
   - 添加：
     ```
     NEXT_PUBLIC_GA_ID = G-NDLZQ2HE5X
     ```

3. **重新部署**
   - Vercel 会自动部署
   - 或手动触发重新部署

### 验证生产环境

部署完成后：

1. 访问 `https://sora-2.site`
2. 打开 Google Analytics
3. 进入 **实时** → **概览**
4. 应该立即看到你的访问

## 📊 Google Analytics 设置检查清单

### 在 Google Analytics 控制台

1. ✅ 确认跟踪 ID 正确：`G-NDLZQ2HE5X`
2. ✅ 检查数据流设置：
   - 转到 **管理** → **数据流**
   - 确认网站 URL 是 `sora-2.site`
3. ✅ 添加允许的引荐来源：
   - localhost（用于测试）
   - sora-2.site（生产）

## 🔧 本地测试（可选）

如果想在本地环境也收集数据：

1. 打开 `.env.local`
2. 确认有这行：
   ```bash
   NEXT_PUBLIC_GA_ID=G-NDLZQ2HE5X
   ```
3. 重启开发服务器
4. 访问 http://localhost:3002
5. 打开 Google Analytics 实时报告
6. 应该能看到来自 localhost 的访问

**注意**：开发环境的数据会污染生产数据，建议：
- 使用单独的 GA 属性用于开发
- 或者只在生产环境启用 GA

## 🎯 期望结果

### 部署后应该看到的数据

**实时报告**（立即可见）：
- 当前活跃用户
- 浏览量
- 热门页面
- 地理位置

**标准报告**（24小时后）：
- 用户总数
- 会话数
- 跳出率
- 平均会话时长
- 流量来源
- 设备类型

## 🐛 故障排除

### 问题：在生产环境也看不到数据

**解决方案**：

1. **检查代码是否部署**
   ```bash
   # 在浏览器开发者工具中检查
   view-source:https://sora-2.site
   # 搜索 "gtag" 或 "G-NDLZQ2HE5X"
   ```

2. **检查环境变量**
   - Vercel 项目设置
   - 确认 `NEXT_PUBLIC_GA_ID` 已设置

3. **检查 GA 跟踪 ID**
   - 确认是 `G-NDLZQ2HE5X` 而不是其他格式

4. **清除缓存**
   ```bash
   # 清除浏览器缓存
   Ctrl + Shift + Delete
   # 或使用隐私模式
   ```

### 问题：数据延迟

**说明**：
- **实时报告**：几乎即时（5-10秒延迟）
- **标准报告**：24-48小时延迟
- 这是正常的 Google Analytics 行为

## 📝 验证检查清单

部署到生产后，按此清单验证：

- [ ] 代码已推送到 GitHub
- [ ] Vercel 已重新部署
- [ ] 环境变量 `NEXT_PUBLIC_GA_ID` 已配置
- [ ] 访问 https://sora-2.site
- [ ] 打开浏览器开发者工具 → Network
- [ ] 看到 `gtag/js` 请求
- [ ] 打开 Google Analytics 实时报告
- [ ] 看到活跃用户（至少1个，就是你）

## 🎉 成功标志

当你看到以下内容时，说明配置成功：

1. **浏览器开发者工具**
   ```
   ✅ 请求: gtag/js?id=G-NDLZQ2HE5X (状态: 200)
   ✅ 请求: collect?v=1&... (状态: 200)
   ```

2. **浏览器控制台**
   ```javascript
   window.dataLayer
   // 输出: [...]（包含配置数据）
   ```

3. **Google Analytics 实时报告**
   ```
   ✅ 当前活跃用户: 1（或更多）
   ✅ 显示你访问的页面
   ✅ 显示地理位置
   ```

---

**总结**：代码已经正确添加，在部署到 sora-2.site 后就会开始收集数据！
