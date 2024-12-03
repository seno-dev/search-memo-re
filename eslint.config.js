import ts from 'typescript-eslint'
import next from '@next/eslint-plugin-next'
import config from '@seno-dev/eslint-config'
import importScope from 'eslint-plugin-import-scope'

export default ts.config(
  {
    ignores: ['.next', 'dist', 'public', 'components/ui/snippets'],
  },
  {
    ...next.configs.recommended,
    plugins: {
      '@next/next': next,
    },
  },
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-scope': importScope,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            'zod',
            { name: 'vitest-browser-react', importNames: ['render'] },
          ],
          patterns: ['**/__mocks__/**'],
        },
      ],
      'import-scope/import-scope': [
        'error',
        [
          { dir: 'features/*', scope: '.' },
          { file: 'features/*/api.ts', scope: './components' },
          { file: 'features/*/components/*.container.tsx', scope: 'app' },
          { dir: 'features/_*', scope: ['features', 'app', 'e2e'] },
        ],
      ],
    },
  },
)
