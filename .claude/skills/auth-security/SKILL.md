---
name: auth-security
description: Maintain Supabase login, sessions, admin access, publishing authorization, secrets, and security boundaries for the Jiaming blog.
---

# Auth Security

Read Supabase, AuthContext, AuthDialog, AdminPage, and publishing APIs.

- Treat `VITE_SUPABASE_URL` and the publishable key as client configuration, never admin authority.
- Keep privileged tokens and `SECRET` server-side.
- Never print, copy, commit, or document real credentials.
- Preserve refresh, logout, loading, error, and unconfigured states.
- Verify server authorization for publish, edit, and delete.
- Do not change production providers, redirects, users, secrets, or policies without approval.
- Test unauthenticated, authenticated, expired, and missing-configuration paths.
