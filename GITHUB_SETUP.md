# GitHub 仓库设置指南

## 1. 创建 GitHub 仓库

### 步骤 1: 在 GitHub 上创建新仓库

1. 访问 [GitHub.com](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `sora-2-site`
   - **Description**: `Sora 2 AI - 专业图像转视频生成器`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Add a README file"（我们已经有了）
   - **不要**勾选 "Add .gitignore"（我们已经有了）
   - **不要**选择 License（可选）

4. 点击 "Create repository"

### 步骤 2: 连接本地项目到 GitHub

在项目根目录运行以下命令：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件到暂存区
git add .

# 提交文件
git commit -m "Initial commit: Sora 2 AI website"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/sora-2-site.git

# 推送到 GitHub
git push -u origin main
```

## 2. 配置 GitHub Actions（可选）

创建 `.github/workflows/ci.yml` 文件来自动化测试和部署：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build project
      run: npm run build
```

## 3. 设置分支保护规则

1. 进入仓库的 "Settings" 页面
2. 点击左侧的 "Branches"
3. 点击 "Add rule"
4. 配置保护规则：
   - **Branch name pattern**: `main`
   - 勾选 "Require a pull request before merging"
   - 勾选 "Require status checks to pass before merging"
   - 勾选 "Require branches to be up to date before merging"

## 4. 配置环境变量（用于 GitHub Actions）

在仓库设置中添加 Secrets：

1. 进入 "Settings" > "Secrets and variables" > "Actions"
2. 点击 "New repository secret"
3. 添加以下 secrets：
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - 其他必要的 API 密钥

## 5. 创建 Issues 和 Projects

### 创建 Issue 模板

创建 `.github/ISSUE_TEMPLATE/bug_report.md`：

```markdown
---
name: Bug report
about: 创建 bug 报告
title: '[BUG] '
labels: bug
assignees: ''
---

**描述 Bug**
清晰简洁地描述 bug。

**重现步骤**
重现行为的步骤：
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**预期行为**
清晰简洁地描述你期望发生的事情。

**截图**
如果适用，添加截图来帮助解释你的问题。

**环境信息**
- OS: [e.g. Windows 10]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**额外信息**
添加关于问题的任何其他信息。
```

### 创建功能请求模板

创建 `.github/ISSUE_TEMPLATE/feature_request.md`：

```markdown
---
name: Feature request
about: 为这个项目建议一个想法
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**你的功能请求是否与某个问题相关？请描述。**
清晰简洁地描述问题是什么。例如：我总是很沮丧当 [...]

**描述你想要的解决方案**
清晰简洁地描述你想要发生什么。

**描述你考虑过的替代方案**
清晰简洁地描述你考虑过的任何替代解决方案或功能。

**额外信息**
添加关于功能请求的任何其他信息或截图。
```

## 6. 设置 GitHub Pages（可选）

如果你想使用 GitHub Pages 托管静态版本：

1. 进入仓库 "Settings" > "Pages"
2. 选择 "Deploy from a branch"
3. 选择 "main" 分支和 "/ (root)" 文件夹
4. 点击 "Save"

## 7. 配置 Webhooks（用于 Vercel 自动部署）

1. 进入仓库 "Settings" > "Webhooks"
2. 点击 "Add webhook"
3. 配置：
   - **Payload URL**: `https://api.vercel.com/v1/integrations/deploy/你的项目ID`
   - **Content type**: `application/json`
   - **Events**: 选择 "Just the push event"
   - **Active**: 勾选

## 8. 创建贡献指南

创建 `CONTRIBUTING.md`：

```markdown
# 贡献指南

感谢你考虑为 Sora 2 AI 项目做出贡献！

## 如何贡献

1. Fork 这个仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 添加必要的注释
- 编写测试（如果适用）

## 报告 Bug

使用 GitHub Issues 报告 bug，并包含：
- 详细的描述
- 重现步骤
- 预期行为
- 环境信息

## 建议功能

使用 GitHub Issues 建议新功能，并包含：
- 功能描述
- 使用场景
- 可能的实现方案
```

## 9. 创建 Pull Request 模板

创建 `.github/pull_request_template.md`：

```markdown
## 描述
简要描述这个 PR 的更改。

## 类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 破坏性更改
- [ ] 文档更新

## 测试
- [ ] 我已经测试了这些更改
- [ ] 我已经添加了测试来覆盖我的更改
- [ ] 所有新的和现有的测试都通过了

## 检查清单
- [ ] 我的代码遵循项目的代码规范
- [ ] 我已经进行了自我审查
- [ ] 我已经注释了我的代码，特别是在难以理解的区域
- [ ] 我已经对文档进行了相应的更改
- [ ] 我的更改不会产生新的警告
- [ ] 我已经添加了证明我的修复有效或功能正常工作的测试
- [ ] 新的和现有的单元测试在我的更改下都能通过
```

## 10. 设置标签

在仓库的 "Issues" 页面创建以下标签：

- `bug` - 红色
- `enhancement` - 绿色
- `documentation` - 蓝色
- `good first issue` - 紫色
- `help wanted` - 橙色
- `priority: high` - 红色
- `priority: medium` - 黄色
- `priority: low` - 绿色

## 完成！

现在你的 GitHub 仓库已经完全配置好了，可以：

1. 接受贡献者的 Pull Request
2. 使用 Issues 跟踪 bug 和功能请求
3. 自动部署到 Vercel
4. 维护项目的代码质量

下一步：配置 Vercel 部署！

