---
name: playwright-regression
description: Run, extend, and interpret Playwright tests for navigation, posts, search, login visibility, repeated clicks, APIs, SEO endpoints, and responsive behavior.
---

# Playwright Regression

1. Read `playwright.config.ts` and `tests/smoke.spec.ts`.
2. Add the smallest stable test covering the change.
3. Prefer roles, labels, and durable classes over coordinates and arbitrary waits.
4. Run relevant tests, then the complete suite.
5. Never weaken or delete a failing assertion to obtain green.
6. Separate code, environment, network, and production dependency failures.
7. On failure, stop and report command, evidence, impact, and proposed fix.
8. Record exact passed and failed counts.
