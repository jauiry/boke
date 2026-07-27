# 嘉明个人博客 Claude Code 协作规则

## 强制入口

开始任何任务前，完整读取 `F:\Obsidian\个人知识库\04-整理笔记\嘉明AI协作全规则.md`。无法读取时停止一切写入并报告。

## 项目信息

- 工作区：`C:\workspace\project-001`
- 仓库：`https://github.com/jauiry/boke`
- 生产分支：`master`
- 网站：`https://www.mxqys.xyz`
- Vercel：`mxqys-blog`
- 栈：React 19、TypeScript、Vite、Tailwind、Framer Motion、Supabase、Vercel Functions、Playwright

## 强制流程

1. 读取规则、相关技能和目标文件。
2. 汇报“问题 → 原因 → 影响 → 方案”，等待确认。
3. 只做已确认的最小改动。
4. 写后重读并检查 diff。
5. 执行 lint、typecheck、build 和 Playwright。
6. 失败时停止，报告后等待确认。
7. 仅用 `agent/claude-*` 分支和 Draft PR。

## 禁止

不得直接提交或推送 `master`；不得 force push、合并、部署生产、修改密钥或权限、输出凭据、绕过检查、无批准新增依赖或扩大范围；不得使用 `--dangerously-skip-permissions`。不要采用 `DEPLOY_GUIDE.md` 中的 classic Token 和强制推送示例。

## 技能路由

- 接手：`project-onboarding`
- 视觉：`ink-design-system`、`ui-quality-review`
- 前端：`frontend-react-vite`
- 粒子：`particle-performance`
- 测试：`playwright-regression`
- 登录：`auth-security`
- 文章：`obsidian-content-pipeline`
- 发布：`github-vercel-release`
- 夜间：`overnight-orchestrator`
