---
name: overnight-orchestrator
description: Execute a bounded overnight blog task with staged work, strict permissions, stop conditions, verification, logging, and a draft pull request handoff.
---

# Overnight Orchestrator

## Preconditions

- Read global rules, `CLAUDE.md`, and relevant skills.
- Require one objective, allowed scope, acceptance criteria, and turn limit.
- Confirm a safe tree and create `agent/claude-<task>`.

## Stages

1. Record baseline branch, commit, status, build, and tests.
2. Audit with evidence.
3. Implement small approved checkpoints.
4. Run lint, typecheck, build, full Playwright, and visual checks.
5. Commit, push, create one Draft PR, and write `.claude/overnight-report.md`.

Stop on failed tests, missing rules, destructive ambiguity, credentials, production actions, conflicts, unexpected files, or scope expansion. Never merge, deploy production, change secrets, force push, install dependencies, or skip permissions.
