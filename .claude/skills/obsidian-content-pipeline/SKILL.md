---
name: obsidian-content-pipeline
description: Review, normalize, import, and publish Markdown from Jiaming's Obsidian notes without exposing private notes or damaging source files.
---

# Obsidian Content Pipeline

Source: `F:\Obsidian\个人知识库\04-整理笔记`.

1. Inventory Markdown and exclude rules, secrets, private records, drafts, and unrelated notes.
2. Review frontmatter, headings, links, images, code, sensitive data, and suitability.
3. Present the proposed article list and edits for confirmation.
4. Preserve source notes; transform only approved content.
5. Follow current blog types and `src/data/blogData.ts`.
6. Use stable unique slugs and verify excerpt, category, tags, date, and reading time.
7. Test rendering, navigation, search, RSS, and sitemap.
8. Never publish to master or production unattended.
