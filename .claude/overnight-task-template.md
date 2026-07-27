# Claude Code 夜间任务模板

## 唯一目标

[填写一个明确目标，禁止写“全面优化网站”]

## 范围

- 允许修改：
- 禁止修改：
- 允许新增：
- 禁止新增依赖：是

## 验收标准

- [ ] 功能
- [ ] 桌面端
- [ ] 手机端
- [ ] 无障碍
- [ ] 性能
- [ ] 回归测试

## 边界

只能使用 `agent/claude-*` 分支并创建 Draft PR。不得合并、部署生产、修改密钥/域名、强制推送。测试失败、规则不可读、范围不清或出现意外文件时立即停止。

## 必须执行

```powershell
npm run lint
npm run typecheck
npm run build
npx playwright test
```

将结果写入 `.claude/overnight-report.md`，包括变更、测试、截图、失败、风险、PR 和人工操作。

## 推荐命令

```powershell
claude -p --max-turns 40 --allowedTools "Read" "Glob" "Grep" "Edit" "Write" "Bash(git status:*)" "Bash(git diff:*)" "Bash(git switch:*)" "Bash(git add:*)" "Bash(git commit:*)" "Bash(git push:*)" "Bash(npm run lint)" "Bash(npm run typecheck)" "Bash(npm run build)" "Bash(npx playwright test:*)" "读取 .claude/overnight-task-template.md 并执行已填写任务"
```
