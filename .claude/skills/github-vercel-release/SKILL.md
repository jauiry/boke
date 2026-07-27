---
name: github-vercel-release
description: Prepare safe branches, commits, draft pull requests, CI verification, and Vercel handoffs without unattended production changes.
---

# GitHub Vercel Release

- Start from current `master`; create `agent/claude-<task>`.
- Inspect status and preserve unrelated changes.
- Commit only reviewed task files.
- Push the feature branch and create one Draft PR.
- Require lint, typecheck, build, E2E, Lighthouse, and preview evidence where configured.
- Never force push, merge, delete branches, bypass checks, edit secrets, or deploy production unattended.
- Report PR URL, SHA, checks, preview, files, risks, and manual steps.
- Treat classic-token and force-push guidance in `DEPLOY_GUIDE.md` as obsolete.
