# 博客部署详细流程文档

## 项目信息

- **项目名称**: boke
- **技术栈**: Vite + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **GitHub 仓库**: https://github.com/jauiry/boke
- **部署平台**: Vercel
- **博客地址**: https://www.mxqys.xyz

---

## 部署流程概览

```
本地开发 → Git 提交 → GitHub 推送 → Vercel 自动部署 → 上线
```

---

## 详细步骤

### 第一步：环境准备

#### 1.1 配置 Git 代理（可选）

如果网络无法直接访问 GitHub，需要配置代理：

```bash
# 查看代理软件端口，通常是 7890、7897、1080 等
# 本项目使用 Clash Verge，端口为 7897

git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

#### 1.2 初始化 Git 仓库（如尚未初始化）

```bash
cd 项目目录
git init
git add .
git commit -m "Initial commit"
```

#### 1.3 创建 .gitignore 文件

```bash
# .gitignore 内容
node_modules/
dist/
dist-ssr/
.vercel
.env
.env.local
.env.*.local
```

---

### 第二步：关联 GitHub 仓库

#### 2.1 添加远程仓库

```bash
git remote add origin https://github.com/jauiry/boke.git
```

#### 2.2 推送代码到 GitHub

```bash
# 第一次推送需要 -u 设置上游分支
git push -u origin master
```

---

### 第三步：Vercel 项目配置

#### 3.1 登录 Vercel

1. 打开 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录

#### 3.2 导入项目

1. 点击 **Add New Project**
2. 在列表中找到 `jauiry/boke`
3. 点击 **Import**

#### 3.3 确认构建配置

Vercel 会自动检测框架，确认以下配置：

| 设置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

#### 3.4 点击 Deploy 部署

---

### 第四步：配置环境变量

#### 4.1 生成 GitHub Personal Access Token

1. 打开 [github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 **Generate new token (classic)**
3. 勾选 **repo** 权限（用于通过 API 提交文章）
4. 生成后复制 token

#### 4.2 在 Vercel 添加环境变量

1. 打开项目 Settings → Environment Variables
2. 添加以下环境变量：

| Name | Value | 说明 |
|------|-------|------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxxxxxx` | 你的 GitHub Personal Access Token |
| `SECRET` | `your_secret_here` | 发布文章的密码（自定义） |

3. 点击 **Save**

---

### 第五步：重新部署

#### 5.1 手动触发重新部署

1. 打开项目 **Deployments** 页面
2. 点击最新部署
3. 点击右上角 **...** 菜单
4. 选择 **Redeploy**

#### 5.2 等待部署完成

- 部署状态：Building → Ready
- 通常需要 1-3 分钟

---

### 第六步：验证部署

访问博客地址确认正常运行：

- **博客地址**: https://www.mxqys.xyz
- **Vercel 预览**: https://mxqys-blog.vercel.app

---

## 文章发布功能配置

### 功能说明

博客使用 Vercel Serverless Function 实现文章发布：

- **接口路径**: `/api/publish`
- **请求方法**: POST
- **验证方式**: secret 密码验证

### publish.ts 配置说明

文件位置：`api/publish.ts`

```typescript
const CONFIG = {
  githubToken: process.env.GITHUB_TOKEN || '',  // 从环境变量读取
  owner: 'jauiry',           // GitHub 用户名
  repo: 'boke',              // 仓库名
  path: 'src/data/blogData.ts',  // 文章数据文件路径
  secret: process.env.SECRET || '',  // 发布密码
};
```

### 发布请求格式

```json
POST /api/publish
{
  "title": "文章标题",
  "content": "文章内容（Markdown）",
  "categoryId": "1",
  "tags": ["1", "2"],
  "featured": false,
  "secret": "your_secret_here"
}
```

### 响应格式

```json
{
  "success": true,
  "message": "文章发布成功",
  "post": {
    "id": "xxx",
    "title": "文章标题",
    "slug": "文章-slug"
  },
  "postUrl": "https://www.mxqys.xyz/文章-slug"
}
```

---

## 常见问题

### Q1: 构建失败，提示 blogData.ts 语法错误

**原因**: 字符串中包含未转义的换行符

**解决**: 确保字符串使用单行，或正确处理换行

```typescript
// 错误示例
excerpt: '这是第一行
这是第二行'

// 正确示例
excerpt: '这是第一行 这是第二行'
// 或使用模板字符串
content: `这是第一行
这是第二行`
```

### Q2: GitHub 连接被重置

**解决**: 配置 Git 代理

```bash
git config --global http.proxy http://127.0.0.1:7897
git config --global https.proxy http://127.0.0.1:7897
```

### Q3: 推送被拒绝（remote contains work）

**原因**: 远程仓库有本地没有的提交

**解决**: 先拉取合并，或强制覆盖

```bash
# 强制覆盖（会丢失远程的新提交）
git push --force
```

### Q4: 发布文章失败

**检查项**:
1. Vercel 环境变量是否正确配置 `GITHUB_TOKEN`
2. GitHub Token 是否有 repo 权限
3. Token 是否未过期
4. secret 密码是否正确

---

## 后续维护

### 更新代码后自动部署

代码推送到 GitHub 后，Vercel 会自动检测并重新部署。

### 手动部署

在 Vercel Dashboard → Deployments → Redeploy

### 查看部署日志

Vercel Dashboard → Deployments → 点击具体部署 → View Logs

---

## 域名配置（可选）

如需使用自定义域名：

1. Vercel 项目 → Settings → Domains
2. 添加你的域名（如 mxqys.xyz）
3. 按提示配置 DNS 记录

---

## 相关链接

- Vercel 控制台: https://vercel.com/dashboard
- GitHub 仓库: https://github.com/jauiry/boke
- 博客地址: https://www.mxqys.xyz
- GitHub Token 设置: https://github.com/settings/tokens
