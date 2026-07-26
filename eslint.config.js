import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['api/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['src/data/blogData.ts'],
    rules: {
      'no-useless-escape': 'off',
    },
  },
  {
    files: ['src/components/PostList.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/App.tsx', 'src/components/AdminPage.tsx', 'src/components/SearchOverlay.tsx', 'src/hooks/use-mobile.ts'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['src/components/AdminPage.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['src/components/ui/badge.tsx', 'src/components/ui/button.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
